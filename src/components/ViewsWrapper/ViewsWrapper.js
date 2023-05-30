import { useRef } from 'react';
import classNames from "classnames";

import { ROW_SIZE_1, ROWS_GAP, VIEW_HEX, VIEW_ITEM_HEIGHT, VIEW_TEXT } from "../../common/constants";
import { generateByteGroups } from "../../common/tools";
import View from "./View/View";

import styles from './ViewsWrapper.module.scss';

function ViewsWrapper({ bytes, unicodeMode, selectedByteIndex, setSelectedByteIndex }) {
    const wrapperRef = useRef();

    const byteGroups = generateByteGroups(bytes, unicodeMode);

    return (
        <div className={ styles.wrapper } tabIndex="0" onKeyDown={ handleKeyDown } ref={wrapperRef}>
            <div
                className={ classNames(
                    'view--hex',
                    styles['view--hex'],
                    styles.view,
                ) }
            >
                <View
                    viewType={ VIEW_HEX }
                    byteGroups={ byteGroups }
                    selectedByteIndex={ selectedByteIndex }
                    onByteClick={ handleHexViewByteClick }
                />
            </div>

            <div
                className={ classNames(
                    'view--text',
                    styles['view--text'],
                    styles.view,
                ) }
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

    function handleKeyDown(e) {
        const currentRowSize = ROW_SIZE_1; // todo: depends on screen width
        let newIndex;

        switch (e.key) {
            case 'ArrowLeft': {
                if (selectedByteIndex > 0) {
                    newIndex = selectedByteIndex - 1;
                }
                break;
            }
            case 'ArrowRight': {
                if (selectedByteIndex < bytes.length) {
                    newIndex = selectedByteIndex + 1;
                }
                break;
            }
            case 'ArrowUp': {
                e.preventDefault();

                const tmpIndex = selectedByteIndex - currentRowSize;
                if (tmpIndex >= 0) {
                    newIndex = tmpIndex;
                } else {
                    newIndex = 0;
                }
                break;
            }
            case 'ArrowDown': {
                e.preventDefault();

                const tmpIndex = selectedByteIndex + currentRowSize;
                if (tmpIndex < bytes.length) {
                    newIndex = tmpIndex;
                } else {
                    newIndex = bytes.length - 1;
                }
                break;
            }
            default:
        }
        setSelectedByteIndex(newIndex);

        const wrapperHeight = wrapperRef.current.clientHeight;
        const currentRowIndex = Math.floor(newIndex / currentRowSize);
        const currentRowScrollTop = currentRowIndex * (VIEW_ITEM_HEIGHT + ROWS_GAP);
        if (currentRowScrollTop < wrapperRef.current.scrollTop) {
            wrapperRef.current.scrollTop = currentRowScrollTop;
        } else if (currentRowScrollTop > (wrapperRef.current.scrollTop + wrapperHeight - (VIEW_ITEM_HEIGHT + ROWS_GAP))) {
            wrapperRef.current.scrollTop = currentRowScrollTop - wrapperHeight + VIEW_ITEM_HEIGHT + ROWS_GAP;
        }
    }
}

export default ViewsWrapper;
