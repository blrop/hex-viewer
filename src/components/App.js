import { useState } from 'react';
import moment from 'moment';
import classNames from 'classnames';

import { PAGE_SIZE } from '../common/constants';
import HexView from './HexView/HexView';
import TextPreview from './TextPreview/TextPreview';

import styles from './App.module.scss';

function App() {
    const [fileInfo, setFileInfo] = useState();
    const [fileBytes, setFileBytes] = useState();
    const [dragOver, setDragOver] = useState(false);

    return (
        <div className={styles.app}>
            <div className={styles.header}>
                <label className={styles.fileSelectLabel}>
                    Choose file
                    <input type="file" onChange={handleInputFileChange} />
                </label>

                <div className={styles['file-select']}>
                    <div className={styles['file-select__title']}>or drop file here:</div>
                    <div
                        className={classNames(styles['file-select__drop-zone'], { [styles.dragOver]: dragOver })}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onDragLeave={handleDragLeave}
                    />
                </div>

                {fileInfo && (
                    <div className={styles['file-info']}>
                        <div className={styles['file-info__title']}>File Info</div>
                        <div className={styles['file-info__item']}>
                            <h4>Name:</h4> {fileInfo.name}<br/>
                        </div>
                        <div className={styles['file-info__item']}>
                            <h4>Size:</h4> {fileInfo.size}<br/>
                        </div>
                        <div className={styles['file-info__item']}>
                            <h4>Type:</h4> {fileInfo.type}<br/>
                        </div>
                        <div className={styles['file-info__item']}>
                            <h4>Last modified:</h4> {moment(fileInfo.lastModified).format("YYYY.MM.DD HH:mm:ss")}
                        </div>
                    </div>
                )}
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
