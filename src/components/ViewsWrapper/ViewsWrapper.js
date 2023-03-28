import { useState } from 'react';
import classNames from "classnames";
import { ACTIVE_VIEW_HEX, ACTIVE_VIEW_TEXT, ACTIVE_VIEW_NONE } from "../../common/constants";
import HexView from "./HexView/HexView";
import TextPreview from "./TextPreview/TextPreview";

import styles from './ViewsWrapper.module.scss';

function ViewsWrapper({ bytes, unicodeMode }) {
    const [selectedByte, setSelectedByte] = useState();
    const [activeView, setActiveView] = useState(ACTIVE_VIEW_NONE);

    return (
        <div className={ styles.wrapper }>
            <div className={ classNames(styles.hexView, { 'active-view': activeView === ACTIVE_VIEW_HEX }) }>
                <HexView
                    bytes={ bytes }
                    onByteClick={ handleHexViewByteClick }
                    selectedByte={ selectedByte }
                />
            </div>

            <div className={ styles.delimiter }></div>

            <div className={ classNames(styles.textView, { 'active-view': activeView === ACTIVE_VIEW_TEXT }) }>
                <TextPreview
                    bytes={ bytes }
                    onByteClick={ handleTextViewByteClick }
                    unicodeMode={ unicodeMode }
                    selectedByte={ selectedByte }
                />
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
}

export default ViewsWrapper;