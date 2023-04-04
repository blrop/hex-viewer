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
    const renderByte = (group, firstByteIndex, selectedByteIndex) => {
        const renderItem = ({ viewType, bytes, firstByteIndex, indexInGroup, selectedByteIndex }) => {
            const isSecondarySelected = ({ currentIndex, firstByteIndex, selectedByteIndex, totalBytesInGroup }) =>
                firstByteIndex <= selectedByteIndex  && selectedByteIndex < (firstByteIndex + totalBytesInGroup) &&
                selectedByteIndex !== currentIndex;

            let Component;
            let value;
            if (viewType === VIEW_HEX) {
                Component = HexViewItem;
                value = bytes[indexInGroup];
            } else if (viewType === VIEW_TEXT) {
                Component = TextViewItem;
                value = indexInGroup === 0 ? getChar(bytes) : null;
            } else {
                return null;
            }

            const innerByteIndex = firstByteIndex + indexInGroup;
            const isSecondarySelectedValue = isSecondarySelected({
                currentIndex: innerByteIndex,
                firstByteIndex,
                selectedByteIndex,
                totalBytesInGroup: bytes.length
            });

            return (
                <Component
                    key={ `${ firstByteIndex }-${ indexInGroup }` }
                    index={ innerByteIndex }
                    value={ value }
                    onClick={ onByteClick }
                    isSelected={ selectedByteIndex === innerByteIndex }
                    isEmpty={ indexInGroup !== 0 }
                    isSecondarySelected={ isSecondarySelectedValue }
                />
            );
        };

        const itemParams = {
            viewType,
            bytes: group,
            firstByteIndex: firstByteIndex,
            indexInGroup: 0,
            selectedByteIndex,
        };

        const item = renderItem({
            ...itemParams,
            indexInGroup: 0,
        });
        const output = [item];
        for (let i = 1; i < group.length; i++) {
            const item = renderItem({
                ...itemParams,
                indexInGroup: i,
            })
            output.push(item);
        }
        return output;
    };

    return byteGroups.map((group) => renderByte(group.bytes, group.firstByteIndex, selectedByteIndex));
}

export default CommonView;