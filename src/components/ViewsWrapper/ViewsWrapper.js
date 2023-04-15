import classNames from "classnames";

import { VIEW_HEX, VIEW_TEXT } from "../../common/constants";
import { generateByteGroups } from "../../common/tools";
import View from "./View/View";

import styles from './ViewsWrapper.module.scss';

function ViewsWrapper({ bytes, unicodeMode, selectedByteIndex, setSelectedByteIndex }) {
    const rowSize = 24;

    const byteGroups = generateByteGroups(bytes, unicodeMode);

    return (
        <div className={ styles.wrapper } tabIndex="0" onKeyDown={ handleKeyDown }>
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
