import { useState } from 'react';
import classNames from "classnames";

import { VIEW_HEX, VIEW_TEXT, VIEW_NONE } from "../../common/constants";
import { generateByteGroups } from "../../common/tools";
import View from "./View/View";

import styles from './ViewsWrapper.module.scss';
import StatusBar from "../StatusBar/StatusBar";

function ViewsWrapper({ bytes, unicodeMode }) {
    const [selectedByteIndex, setSelectedByteIndex] = useState(-1);
    const [activeView, setActiveView] = useState(VIEW_NONE);

    const rowSize = 24;

    const byteGroups = generateByteGroups(bytes, unicodeMode);

    return (
        <>
            <div className={ styles.wrapper }>
                <div
                    tabIndex="0"
                    className={ classNames(
                        'view--hex',
                        styles['view--hex'],
                        styles.view,
                        { 'active-view': activeView === VIEW_HEX }
                    ) }
                    onFocus={ setActiveHex }
                    onBlur={ handleBlur }
                    onKeyDown={ handleKeyDown }
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
                    onFocus={ setActiveText }
                    onBlur={ handleBlur }
                    onKeyDown={ handleKeyDown }
                >
                    <View
                        viewType={ VIEW_TEXT }
                        byteGroups={ byteGroups }
                        selectedByteIndex={ selectedByteIndex }
                        onByteClick={ handleTextViewByteClick }
                    />
                </div>
            </div>

            <StatusBar currentByte={ bytes[selectedByteIndex] } currentByteIndex={ selectedByteIndex }/>
        </>
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

    function handleKeyDown(e) {
        switch (e.key) {
            case 'ArrowLeft': {
                if (selectedByteIndex > 0) {
                    setSelectedByteIndex(selectedByteIndex - 1);
                }
                break;
            }
            case 'ArrowRight': {
                if (selectedByteIndex < bytes.length) {
                    setSelectedByteIndex(selectedByteIndex + 1);
                }
                break;
            }
            case 'ArrowUp': {
                e.preventDefault();

                const newIndex = selectedByteIndex - rowSize;
                if (newIndex >= 0) {
                    setSelectedByteIndex(newIndex);
                } else {
                    setSelectedByteIndex(0);
                }
                break;
            }
            case 'ArrowDown': {
                e.preventDefault();

                const newIndex = selectedByteIndex + rowSize;
                if (newIndex < bytes.length) {
                    setSelectedByteIndex(newIndex);
                } else {
                    setSelectedByteIndex(bytes.length - 1);
                }
                break;
            }
            default:
        }
    }
}

export default ViewsWrapper;
