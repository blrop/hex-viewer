import { useState } from 'react';
import moment from 'moment';
import classNames from 'classnames';

import { FILE_DUMP_EXAMPLE, PAGE_SIZE } from '../common/constants';

import styles from './App.module.scss';
import ViewsWrapper from "./ViewsWrapper/ViewsWrapper";
import StatusBar from "./StatusBar/StatusBar";
import { fileSizeToUnits } from "../common/tools";

function App() {
    const [file, setFile] = useState();
    const [page, setPage] = useState(1);
    const [fileInfo, setFileInfo] = useState();
    const [fileBytes, setFileBytes] = useState(FILE_DUMP_EXAMPLE);
    const [dragOver, setDragOver] = useState(false);
    const [unicodeMode, setUnicodeMode] = useState(true);
    const [selectedByteIndex, setSelectedByteIndex] = useState(-1);

    return (
        <div className={ styles.app }>
            <div className={ styles.header }>
                <label className={ styles['file-input-label'] } tabIndex="0">
                    Choose file
                    <input type="file" onChange={ handleInputFileChange }/>
                </label>

                <div className={ styles['file-select'] }>
                    <div className={ styles['file-select__title'] }>or drop file here:</div>
                    <div
                        className={ classNames(styles['file-select__drop-zone'], { [styles.dragOver]: dragOver }) }
                        onDragOver={ handleDragOver }
                        onDrop={ handleDrop }
                        onDragLeave={ handleDragLeave }
                    />
                </div>

                <div className={ styles['file-info'] }>
                    <div className={ styles['file-info__title'] }>File Info</div>
                    <div className={ styles['file-info__item'] }>
                        <span className={ styles['file-info__item-title'] }>Name:</span>
                        <span
                            className={ styles['file-info__item-value'] }
                            title={ fileInfo?.name }
                        >{ fileInfo?.name }</span>
                    </div>
                    <div className={ styles['file-info__item'] }>
                        <span className={ styles['file-info__item-title'] }>Size:</span>
                        { fileInfo?.size && <span title={ `${ fileInfo.size } bytes` }>{ fileSizeToUnits(fileInfo.size) }</span> }
                    </div>
                    <div className={ styles['file-info__item'] }>
                        <span className={ styles['file-info__item-title'] }>Type:</span>
                        <span>{ fileInfo?.type }</span>
                    </div>
                    <div className={ styles['file-info__item'] }>
                        <span className={ styles['file-info__item-title'] }>Last modified:</span>
                        <span>{ fileInfo?.lastModified && moment(fileInfo.lastModified).format("YYYY.MM.DD HH:mm:ss") }</span>
                    </div>
                </div>
            </div>

            <div className={ styles['app__body'] }>
                <ViewsWrapper
                    bytes={ fileBytes }
                    unicodeMode={ unicodeMode }
                    selectedByteIndex={ selectedByteIndex }
                    setSelectedByteIndex={ setSelectedByteIndex }
                />
                <StatusBar
                    currentByte={ fileBytes[selectedByteIndex] }
                    currentByteIndex={ selectedByteIndex + ((page - 1) * PAGE_SIZE) }
                    currentPage={ page }
                    totalPages={ fileInfo?.size && Math.ceil(fileInfo?.size / PAGE_SIZE) }
                    setPage={ handleSetPage }
                    unicodeMode={ unicodeMode }
                    toggleUnicodeMode={ toggleUnicodeMode }
                />
            </div>
        </div>
    );

    function toggleUnicodeMode() {
        setUnicodeMode(!unicodeMode);
    }

    function handleDragOver(e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        setDragOver(true);
    }

    function handleDragLeave(e) {
        e.stopPropagation();
        e.preventDefault();
        setDragOver(false);
    }

    function handleDrop(e) {
        e.stopPropagation();
        e.preventDefault();

        if (!e.dataTransfer.files.length) {
            return;
        }

        handleFileSelect(e.dataTransfer.files[0]);
        setDragOver(false);
    }

    function handleInputFileChange(e) {
        if (!e.target.files.length) {
            return;
        }

        handleFileSelect(e.target.files[0]);
    }

    function handleFileLoad(e) {
        const buffer = e.target.result;

        const view = new Uint8Array(buffer);
        setFileBytes(view);
    }

    function handleFileSelect(file) {
        setFile(file);

        setFileInfo({
            lastModified: file.lastModified,
            name: file.name,
            size: file.size,
            type: file.type,
        });

        const bytesToView = PAGE_SIZE <= file.size ? PAGE_SIZE : file.size;
        const blob = file.slice(0, bytesToView);

        const reader = new FileReader();
        reader.onload = handleFileLoad;
        reader.readAsArrayBuffer(blob);
    }

    function handleSetPage(newPage) {
        if (!file) {
            return;
        }

        const start = (newPage - 1) * PAGE_SIZE;
        const end = (newPage - 1) * PAGE_SIZE + PAGE_SIZE;
        const blob = file.slice(start, end <= file.size ? end : file.size);

        const reader = new FileReader();
        reader.onload = handleFileLoad;
        reader.readAsArrayBuffer(blob);

        setPage(newPage);
    }
}

export default App;
