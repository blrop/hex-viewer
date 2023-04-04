import classNames from 'classnames';

import styles from './CommonView.module.scss';
import { VIEW_HEX, VIEW_TEXT } from "../../common/constants";
import { getChar } from "../../common/tools";

function CommonItem({ index, value, onClick, isSelected, isEmpty, isSecondarySelected }) {
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
            { value }
        </div>
    );
}

function HexViewItem({ index, value, onClick, isSelected, isEmpty, isSecondarySelected }) {
    function toHex(number) {
        return (number < 16 ? '0' : '') + number.toString(16);
    }

    return (
        <CommonItem
            index={ index }
            onClick={ onClick }
            isSelected={ isSelected }
            isEmpty={ isEmpty }
            isSecondarySelected={ isSecondarySelected }
            value={ toHex(value) }
        />
    );
}

const TextViewItem = ({ index, value, onClick, isSelected, isEmpty, isSecondarySelected }) => {
    return (
        <CommonItem
            index={ index }
            onClick={ onClick }
            isSelected={ isSelected }
            isEmpty={ isEmpty }
            isSecondarySelected={ isSecondarySelected }
            value={ value && String.fromCharCode(value) }
        />
    );
};


function CommonView({ byteGroups, onByteClick, selectedByteIndex, viewType }) {
    const renderGroup = (group, firstByteIndex, selectedByteIndex) => {
        const renderByte = ({ viewType, bytes, firstByteIndex, indexInGroup, selectedByteIndex }) => {
            const isSecondarySelected = ({ currentIndex, firstByteIndex, selectedByteIndex, totalBytesInGroup }) =>
                firstByteIndex <= selectedByteIndex && selectedByteIndex < (firstByteIndex + totalBytesInGroup) &&
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

export default CommonView;