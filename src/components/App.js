import { useState } from 'react';
import moment from 'moment';

import ProgressBar from './ProgressBar/ProgressBar';
import HexView from './HexView/HexView';
import { PAGE_SIZE } from '../common/constants';

import styles from './App.module.css';
import TextPreview from './TextPreview/TextPreview';

const getChar = (byte1, byte2) => {
    const mask1 = 31;
    const cleanByte1 = byte1 & mask1;
    const mask2 = 63;
    const cleanByte2 = byte2 & mask2;
    const part1 = cleanByte1 >> 2;
    const part2 = ((cleanByte1 & 3) << 6) + cleanByte2;

    return String.fromCodePoint((part1 << 8) + part2);
};

console.log(getChar(209, 143));
console.log(getChar(208, 191));

function App() {
    const [fileInfo, setFileInfo] = useState();
    const [loadingProgress, setLoadingProgress] = useState();
    const [fileValues, setFileValues] = useState();

    return (
        <div className={styles.app}>
            <div className={styles.header}>
                <input type="file" onChange={handleInputFileChange}/>
                {loadingProgress && <ProgressBar value={loadingProgress}/>}
                <div className={styles.dropZone} onDragOver={handleDragOver} onDrop={handleDrop} />
            </div>
            <div className={styles.sidebar}>
                {fileInfo && (
                    <div className="file-info">
                        Name: {fileInfo.name}<br/>
                        Size: {fileInfo.size}<br/>
                        Type: {fileInfo.type}<br/>
                        Last modified: {moment(fileInfo.lastModified).format("YYYY.MM.DD HH:mm:ss")}
                    </div>
                )}
            </div>
            <div className={styles.hexView}>
                {fileValues && <HexView values={fileValues}/>}
            </div>
            <div className={styles.textView}>
                {fileValues && <TextPreview values={fileValues}/>}
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
            setFileValues(view);
        }

        function handleReaderProgress(e) {
            const percent = Math.round(e.loaded / (e.total / 100));
            setLoadingProgress(percent);
        }
    }
}

export default App;
