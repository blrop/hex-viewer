import { useState } from 'react';
import classNames from "classnames";
import { ACTIVE_VIEW_HEX, ACTIVE_VIEW_TEXT, ACTIVE_VIEW_NONE } from "../../common/constants";
import HexView from "./HexView/HexView";
import TextPreview from "./TextPreview/TextPreview";

import styles from './ViewsWrapper.module.scss';
import { getSymbolLength, makeBytesIterator } from "../../common/tools";

function ViewsWrapper({ bytes, unicodeMode }) {
    const [selectedByteIndex, setSelectedByteIndex] = useState();
    const [activeView, setActiveView] = useState(ACTIVE_VIEW_NONE);

    const byteGroups = generateByteGroups(bytes, unicodeMode);

    return (
        <div className={ styles.wrapper }>
            <div className={ classNames(styles.hexView, { 'active-view': activeView === ACTIVE_VIEW_HEX }) }>
                <HexView
                    byteGroups={ byteGroups }
                    onByteClick={ handleHexViewByteClick }
                    selectedByteIndex={ selectedByteIndex }
                />
            </div>

            <div className={ styles.delimiter }></div>

            <div className={ classNames(styles.textView, { 'active-view': activeView === ACTIVE_VIEW_TEXT }) }>
                <TextPreview
                    byteGroups={ byteGroups }
                    onByteClick={ handleTextViewByteClick }
                    selectedByteIndex={ selectedByteIndex }
                />
            </div>
        </div>
    );

    function handleTextViewByteClick(byteIndex) {
        setActiveView(ACTIVE_VIEW_TEXT);
        setSelectedByteIndex(byteIndex);
    }

    function handleHexViewByteClick(byteIndex) {
        setActiveView(ACTIVE_VIEW_HEX);
        setSelectedByteIndex(byteIndex);
    }

    function generateByteGroups(bytes, unicodeMode) {
        const bytesIterator = makeBytesIterator(bytes);
        const output = [];

        let result = bytesIterator.next();
        let index = 0;
        while (!result.done) {
            const byte = result.value;
            const symbolLength = unicodeMode ? getSymbolLength(byte) : 1;
            const bytesOfSymbol = [byte];
            const firstByteIndex = index;

            for (let i = 1; i < symbolLength; i++) {
                result = bytesIterator.next();
                index++;

                bytesOfSymbol.push(result.value);
                if (result.done) {
                    break;
                }
            }

            output.push({ bytes: bytesOfSymbol, firstByteIndex });

            result = bytesIterator.next()
            index++;
        }

        return output;
    }
}

export default ViewsWrapper;