import classNames from 'classnames';

import { VIEW_HEX, VIEW_TEXT } from "../../common/constants";
import { getChar } from "../../common/tools";

import styles from './View.module.scss';

function Item({ viewType, index, onClick, isSelected, isEmpty, isSecondarySelected, bytes, indexInGroup }) {
    function toHex(number) {
        return (number < 16 ? '0' : '') + number.toString(16);
    }

    const handleClick = () => onClick(index);

    let valueToShow;
    if (viewType === VIEW_HEX) {
        valueToShow = toHex(bytes[indexInGroup]);
    } else if (viewType === VIEW_TEXT) {
        valueToShow = indexInGroup === 0 ? String.fromCharCode(getChar(bytes)) : null;
    } else {
        return null;
    }

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
            { valueToShow }
        </div>
    );
}

function View({ byteGroups, onByteClick, selectedByteIndex, viewType }) {
    const renderGroup = (group, firstByteIndex, selectedByteIndex) => {
        const renderByte = ({ viewType, bytes, firstByteIndex, indexInGroup, selectedByteIndex }) => {
            const isSecondarySelected = ({ currentIndex, firstByteIndex, selectedByteIndex, totalBytesInGroup }) =>
                firstByteIndex <= selectedByteIndex && selectedByteIndex < (firstByteIndex + totalBytesInGroup) &&
                selectedByteIndex !== currentIndex;

            const innerByteIndex = firstByteIndex + indexInGroup;
            const isSecondarySelectedValue = isSecondarySelected({
                currentIndex: innerByteIndex,
                firstByteIndex,
                selectedByteIndex,
                totalBytesInGroup: bytes.length
            });

            return (
                <Item
                    viewType={viewType}
                    key={ `${ firstByteIndex }-${ indexInGroup }` }
                    index={ innerByteIndex }
                    onClick={ onByteClick }
                    isSelected={ selectedByteIndex === innerByteIndex }
                    isEmpty={ indexInGroup !== 0 }
                    isSecondarySelected={ isSecondarySelectedValue }
                    bytes={bytes}
                    indexInGroup={indexInGroup}
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

        const item = renderByte({
            ...itemParams,
            indexInGroup: 0,
        });
        const output = [item];
        for (let i = 1; i < group.length; i++) {
            const item = renderByte({
                ...itemParams,
                indexInGroup: i,
            })
            output.push(item);
        }
        return output;
    };

    return byteGroups.map((group) => renderGroup(group.bytes, group.firstByteIndex, selectedByteIndex));
}

export default View;