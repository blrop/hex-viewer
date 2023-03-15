import { useState } from 'react';
import moment from 'moment';

import { PAGE_SIZE } from '../common/constants';
import ProgressBar from './ProgressBar/ProgressBar';
import HexView from './HexView/HexView';
import TextPreview from './TextPreview/TextPreview';

import styles from './App.module.css';

function App() {
    const [fileInfo, setFileInfo] = useState();
    const [loadingProgress, setLoadingProgress] = useState();
    const [fileBytes, setFileBytes] = useState();

    return (
        <div className={styles.app}>
            <div className={styles.header}>
                <input type="file" onChange={handleInputFileChange}/>
                {loadingProgress && <ProgressBar value={loadingProgress}/>}
                {fileInfo && (
                    <div className={styles.fileInfo}>
                        Name: {fileInfo.name}<br/>
                        Size: {fileInfo.size}<br/>
                        Type: {fileInfo.type}<br/>
                        Last modified: {moment(fileInfo.lastModified).format("YYYY.MM.DD HH:mm:ss")}
                    </div>
                )}
                <div className={styles.dropZone} onDragOver={handleDragOver} onDrop={handleDrop} />
            </div>
            <div className={styles.hexView}>
                {fileBytes && <HexView bytes={fileBytes} />}
            </div>
            <div className={styles.textView}>
                {fileBytes && <TextPreview bytes={fileBytes} />}
            </div>
        </div>
    );

    function handleDragOver(e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
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
        reader.onprogress = handleReaderProgress;
        reader.onload = handleReaderLoad;

        let bytesToView = file.size <= PAGE_SIZE ? file.size : PAGE_SIZE;
        const blob = file.slice(0, bytesToView);
        reader.readAsArrayBuffer(blob);

        function handleReaderLoad(e) {
            setLoadingProgress(null);

            const buffer = e.target.result;

            const view = new Uint8Array(buffer);
            setFileBytes(view);
        }

        function handleReaderProgress(e) {
            const percent = Math.round(e.loaded / (e.total / 100));
            setLoadingProgress(percent);
        }
    }
}

export default App;
