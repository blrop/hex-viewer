import { useState } from 'react';
import moment from 'moment';
import classNames from 'classnames';

import { PAGE_SIZE } from '../common/constants';

import styles from './App.module.scss';
import ViewsWrapper from "./ViewsWrapper/ViewsWrapper";

function App() {
    const [fileInfo, setFileInfo] = useState();
    const [fileBytes, setFileBytes] = useState();
    const [dragOver, setDragOver] = useState(false);
    const [unicodeMode, setUnicodeMode] = useState(true);

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

                { fileInfo && (
                    <div className={ styles['file-info'] }>
                        <div className={ styles['file-info__title'] }>File Info</div>
                        <div className={ styles['file-info__item'] }>
                            <h4>Name:</h4>
                            <span
                                className={styles['file-info__item-value']}
                                title={ fileInfo.name }
                            >{ fileInfo.name }</span>
                        </div>
                        <div className={ styles['file-info__item'] }>
                            <h4>Size:</h4>
                            <span>{ fileInfo.size }</span>
                        </div>
                        <div className={ styles['file-info__item'] }>
                            <h4>Type:</h4>
                            <span>{ fileInfo.type }</span>
                        </div>
                        <div className={ styles['file-info__item'] }>
                            <h4>Last modified:</h4>
                            <span>{ moment(fileInfo.lastModified).format("YYYY.MM.DD HH:mm:ss") }</span>
                        </div>
                    </div>
                ) }

                <label className={ styles['unicode-mode'] }>
                    <input type="checkbox" checked={ unicodeMode } onChange={ handleUnicodeModeChange }/>
                    Unicode mode
                </label>
            </div>

            { fileBytes && <ViewsWrapper bytes={ fileBytes } unicodeMode={ unicodeMode }/> }

            <div className={styles['status-bar']}></div>
        </div>
    );

    function handleUnicodeModeChange() {
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

    function handleFileSelect(file) {
        setFileInfo({
            lastModified: file.lastModified,
            name: file.name,
            size: file.size,
            type: file.type,
        });

        const reader = new FileReader();
        reader.onload = handleReaderLoad;

        const bytesToView = file.size <= PAGE_SIZE ? file.size : PAGE_SIZE;
        const blob = file.slice(0, bytesToView);
        reader.readAsArrayBuffer(blob);

        function handleReaderLoad(e) {
            const buffer = e.target.result;

            const view = new Uint8Array(buffer);
            setFileBytes(view);
        }
    }
}

export default App;
