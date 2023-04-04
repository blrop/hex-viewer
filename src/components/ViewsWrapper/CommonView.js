import classNames from 'classnames';

import styles from './CommonView.module.scss';
import { VIEW_HEX, VIEW_TEXT } from "../../common/constants";
import { getChar } from "../../common/tools";

function HexViewItem({ index, value, onClick, isSelected, isEmpty, isSecondarySelected }) {
    function toHex(number) {
        return (number < 16 ? '0' : '') + number.toString(16);
    }

    const handleClick = () => onClick(index);

    return (
        <div
            onClick={ handleClick }
            className={
                classNames(styles.value, {
                    [styles['value--selected']]: isSelected,
                    [styles['value--empty']]: isEmpty,
                    [styles['value--secondary-selected']]: isSecondarySelected,
                })
            }
        >
            { toHex(value) }
        </div>
    );
}

const TextViewItem = ({ index, value, onClick, isSelected, isEmpty, isSecondarySelected }) => {
    const handleClick = () => onClick(index);

    return (
        <div
            data-index={ index }
            className={
                classNames(styles.value, {
                    [styles['value--selected']]: isSelected,
                    [styles['value--empty']]: isEmpty,
                    [styles['value--secondary-selected']]: isSecondarySelected,
                })
            }
            onClick={ handleClick }
        >
            { value && String.fromCharCode(value) }
        </div>
    );
};


function CommonView({ byteGroups, onByteClick, selectedByteIndex, viewType }) {
    const renderByte = (group, firstByteIndex) => {
        const renderItem = ({ viewType, key, index, isSelected, isEmpty, isSecondarySelected, currentIndex, bytes }) => {
            let Component;
            let value;
            if (viewType === VIEW_HEX) {
                Component = HexViewItem;
                value = bytes[currentIndex];
            } else if (viewType === VIEW_TEXT) {
                Component = TextViewItem;
                value = currentIndex === 0 ? getChar(group) : null;
            } else {
                return null;
            }

            return (
                <Component
                    key={ key }
                    index={ index }
                    value={ value }
                    onClick={ onByteClick }
                    isSelected={ isSelected }
                    isEmpty={isEmpty}
                    isSecondarySelected={ isSecondarySelected }
                />
            );
        };

        const isSecondarySelected = (currentIndex) =>
            firstByteIndex <= selectedByteIndex  && selectedByteIndex < (firstByteIndex + group.length) &&
            selectedByteIndex !== currentIndex;

        const item = renderItem({
            viewType,
            key: firstByteIndex,
            index: firstByteIndex,
            isSelected: selectedByteIndex === firstByteIndex,
            isEmpty: false,
            isSecondarySelected: isSecondarySelected(firstByteIndex),

            currentIndex: 0,
            bytes: group,
        });
        const output = [item];
        for (let i = 1; i < group.length; i++) {
            const innerByteIndex = firstByteIndex + i;
            const item = renderItem({
                viewType,
                key: `${ firstByteIndex }-${ i }`,
                index: innerByteIndex,
                isSelected: selectedByteIndex === innerByteIndex,
                isEmpty: true,
                isSecondarySelected: isSecondarySelected(innerByteIndex),

                currentIndex: i,
                bytes: group,
            })
            output.push(item);
        }
        return output;
    };

    return byteGroups.map((group) => renderByte(group.bytes, group.firstByteIndex));
}

export default CommonView;