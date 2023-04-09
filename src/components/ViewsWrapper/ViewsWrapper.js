import { useState } from 'react';
import classNames from "classnames";

import { VIEW_HEX, VIEW_TEXT, VIEW_NONE } from "../../common/constants";
import View from "./View/View";

import styles from './ViewsWrapper.module.scss';
import { getSymbolLength, makeBytesIterator } from "../../common/tools";

const generateByteGroups = (bytes, unicodeMode) => {
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
            
            if (result.done) {
                break;
            }
            bytesOfSymbol.push(result.value);
        }

        output.push({ bytes: bytesOfSymbol, firstByteIndex });

        result = bytesIterator.next()
        index++;
    }

    return output;
}

function ViewsWrapper({ bytes, unicodeMode }) {
    const [selectedByteIndex, setSelectedByteIndex] = useState();
    const [activeView, setActiveView] = useState(VIEW_NONE);

    const byteGroups = generateByteGroups(bytes, unicodeMode);

    return (
        <div className={ styles.wrapper }>
            <div
                tabIndex="0"
                className={ classNames(
                    'view--hex',
                    styles['view--hex'],
                    styles.view,
                    { 'active-view': activeView === VIEW_HEX }
                ) }
                onFocus={setActiveHex}
                onBlur={handleBlur}
            >
                <View
                    viewType={ VIEW_HEX }
                    byteGroups={ byteGroups }
                    selectedByteIndex={ selectedByteIndex }
                    onByteClick={ handleHexViewByteClick }
                />
            </div>

            <div
                tabIndex="0"
                className={ classNames(
                    'view--text',
                    styles['view--text'],
                    styles.view,
                    { 'active-view': activeView === VIEW_TEXT }
                ) }
                onFocus={setActiveText}
                onBlur={handleBlur}
            >
                <View
                    viewType={ VIEW_TEXT }
                    byteGroups={ byteGroups }
                    selectedByteIndex={ selectedByteIndex }
                    onByteClick={ handleTextViewByteClick }
                />
            </div>
        </div>
    );

    function handleTextViewByteClick(byteIndex) {
        setSelectedByteIndex(byteIndex);
    }

    function handleHexViewByteClick(byteIndex) {
        setSelectedByteIndex(byteIndex);
    }

    function setActiveHex() {
        setActiveView(VIEW_HEX);
    }

    function setActiveText() {
        setActiveView(VIEW_TEXT);
    }

    function handleBlur() {
        setActiveView(VIEW_NONE);
    }
}

export default ViewsWrapper;