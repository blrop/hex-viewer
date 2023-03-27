import { useState } from 'react';
import moment from 'moment';
import classNames from 'classnames';

import { ACTIVE_VIEW_HEX, ACTIVE_VIEW_TEXT, PAGE_SIZE } from '../common/constants';
import HexView from './HexView/HexView';
import TextPreview from './TextPreview/TextPreview';

import styles from './App.module.scss';


function App() {
    const [fileInfo, setFileInfo] = useState();
    const [fileBytes, setFileBytes] = useState();
    const [dragOver, setDragOver] = useState(false);
    const [unicodeMode, setUnicodeMode] = useState(true);

    const [selectedByte, setSelectedByte] = useState();
    const [activeView, setActiveView] = useState();

    return (
        <div className={ styles.app }>
            <div className={ styles.header }>
                <label className={ styles.fileSelectLabel }>
                    Choose file
                    <input type="file" onChange={ handleInputFileChange }/>
                </label>

                <div className={ styles['file-select'] }>
                    <div className={ styles['file-select__title'] }>or drop file here:</div>
                    <div
                        className={ classNames(styles['file-select__drop-zone'], {[styles.dragOver]: dragOver}) }
                        onDragOver={ handleDragOver }
                        onDrop={ handleDrop }
                        onDragLeave={ handleDragLeave }
                    />
                </div>

                { fileInfo && (
                    <div className={ styles['file-info'] }>
                        <div className={ styles['file-info__title'] }>File Info</div>
                        <div className={ styles['file-info__item'] }>
                            <h4>Name:</h4> { fileInfo.name }<br/>
                        </div>
                        <div className={ styles['file-info__item'] }>
                            <h4>Size:</h4> { fileInfo.size }<br/>
                        </div>
                        <div className={ styles['file-info__item'] }>
                            <h4>Type:</h4> { fileInfo.type }<br/>
                        </div>
                        <div className={ styles['file-info__item'] }>
                            <h4>Last modified:</h4> { moment(fileInfo.lastModified).format("YYYY.MM.DD HH:mm:ss") }
                        </div>
                    </div>
                ) }

                <label>
                    <input type="checkbox" checked={ unicodeMode } onChange={ handleUnicodeModeChange }/>
                    Unicode mode
                </label>
            </div>

            <div className={ classNames(styles.hexView, { 'active-view': activeView === ACTIVE_VIEW_HEX }) }>
                { fileBytes && (
                    <HexView
                        bytes={ fileBytes }
                        onByteClick={ handleHexViewByteClick }
                        selectedByte={ selectedByte }
                    />
                ) }
            </div>

            <div className={ classNames(styles.textView, { 'active-view': activeView === ACTIVE_VIEW_TEXT }) }>
                { fileBytes && (
                    <TextPreview
                        bytes={ fileBytes }
                        onByteClick={ handleTextViewByteClick }
                        unicodeMode={ unicodeMode }
                        selectedByte={ selectedByte }
                    />
                ) }
            </div>
        </div>
    );

    function handleTextViewByteClick(byteIndex) {
        setActiveView(ACTIVE_VIEW_TEXT);
        setSelectedByte(byteIndex);
    }

    function handleHexViewByteClick(byteIndex) {
        setActiveView(ACTIVE_VIEW_HEX);
        setSelectedByte(byteIndex);
    }

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
