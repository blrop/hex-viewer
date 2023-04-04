import { useState } from 'react';
import classNames from "classnames";

import { VIEW_HEX, VIEW_TEXT, VIEW_NONE } from "../../common/constants";
import View from "./View/View";

import styles from './ViewsWrapper.module.scss';
import { getSymbolLength, makeBytesIterator } from "../../common/tools";

function ViewsWrapper({ bytes, unicodeMode }) {
    const [selectedByteIndex, setSelectedByteIndex] = useState();
    const [activeView, setActiveView] = useState(VIEW_NONE);

    const byteGroups = generateByteGroups(bytes, unicodeMode);

    return (
        <div className={ styles.wrapper }>
            <div className={ classNames(styles.hexView, { 'active-view': activeView === VIEW_HEX }) }>
                <View
                    viewType={VIEW_HEX}
                    byteGroups={ byteGroups }
                    selectedByteIndex={ selectedByteIndex }
                    onByteClick={ handleHexViewByteClick }
                />
            </div>

            <div className={ styles.delimiter }></div>

            <div className={ classNames(styles.textView, { 'active-view': activeView === VIEW_TEXT }) }>
                <View
                    viewType={VIEW_TEXT}
                    byteGroups={ byteGroups }
                    selectedByteIndex={ selectedByteIndex }
                    onByteClick={ handleTextViewByteClick }
                />
            </div>
        </div>
    );

    function handleTextViewByteClick(byteIndex) {
        setActiveView(VIEW_TEXT);
        setSelectedByteIndex(byteIndex);
    }

    function handleHexViewByteClick(byteIndex) {
        setActiveView(VIEW_HEX);
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