import { useState } from 'react';
import moment from 'moment';

import './App.css';
import ProgressBar from './ProgressBar/ProgressBar';
import HexView from './HexView/HexView';
import { PAGE_SIZE } from '../common/constants';

function App() {
    const [fileInfo, setFileInfo] = useState();
    const [loadingProgress, setLoadingProgress] = useState();
    const [hexValues, setHexValues] = useState();

    return (
        <div className="app">
            <input type="file" onChange={handleFileChange}/>
            {fileInfo && <div className="file-info">
                Name: {fileInfo.name}<br/>
                Size: {fileInfo.size}<br/>
                Type: {fileInfo.type}<br/>
                Last modified: {moment(fileInfo.lastModified).format("YYYY.MM.DD HH:mm:ss")}
            </div>}

            {loadingProgress && <ProgressBar value={loadingProgress}/>}

            {hexValues && <HexView values={hexValues}/>}
        </div>
    );

    function handleFileChange(e) {
        if (!e.target.files.length) {
            return;
        }

        const file = e.target.files[0];

        setFileInfo({
            lastModified: file.lastModified,
            name: file.name,
            size: file.size,
            type: file.type,
        });

        const reader = new FileReader();
        reader.onprogress = (e) => {
            const percent = Math.round(e.loaded / (e.total / 100));
            setLoadingProgress(percent);
        };
        reader.onload = (e) => {
            setLoadingProgress(null);

            const buffer = e.target.result;

            let view = new Uint8Array(buffer);
            setHexValues(view);
        };

        let bytesToView = file.size <= PAGE_SIZE ? file.size : PAGE_SIZE;
        const blob = file.slice(0, bytesToView);
        reader.readAsArrayBuffer(blob);
    }
}

export default App;
