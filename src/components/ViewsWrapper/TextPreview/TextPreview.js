import classNames from 'classnames';

import { getChar } from "../../../common/tools";

import styles from './TextPreview.module.scss';

const Item = ({ index, charCode, onClick, isSelected, isEmpty, isSecondarySelected }) => {
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
            { charCode && String.fromCharCode(charCode) }
        </div>
    );
};

const TextPreview = ({ byteGroups, onByteClick, selectedByteIndex }) => {
    const renderSymbol = (group, firstByteIndex) => {
        const isSecondarySelected = (currentIndex) =>
            firstByteIndex <= selectedByteIndex  && selectedByteIndex < (firstByteIndex + group.length) &&
            selectedByteIndex !== currentIndex;

        const output = [
            <Item
                key={ firstByteIndex }
                index={ firstByteIndex }
                charCode={ getChar(group) }
                onClick={ onByteClick }
                isSelected={ selectedByteIndex === firstByteIndex }
                isSecondarySelected={ isSecondarySelected(firstByteIndex) }
            />
        ];
        for (let i = 1; i < group.length; i++) {
            const innerByteIndex = firstByteIndex + i;
            output.push(
                <Item
                    key={ `${ firstByteIndex }-${ i }` }
                    index={ innerByteIndex }
                    onClick={ onByteClick }
                    isSelected={ selectedByteIndex === innerByteIndex }
                    isEmpty={ true }
                    isSecondarySelected={ isSecondarySelected(innerByteIndex) }
                />
            );
        }
        return output;
    };

    return byteGroups.map((group) => renderSymbol(group.bytes, group.firstByteIndex));
};

export default TextPreview;