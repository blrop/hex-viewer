import classNames from 'classnames';

import { getChar } from "../../../common/tools";

import styles from './TextPreview.module.scss';

const Item = ({ empty, index, charCode, onClick, isSelected }) => {
    const handleClick = () => onClick(index);

    return (
        <div
            data-index={ index }
            className={
                classNames(styles.value, {
                    [styles['value--empty']]: empty,
                    [styles['value--selected']]: isSelected,
                })
            }
            onClick={ handleClick }
        >
            { charCode && String.fromCharCode(charCode) }
        </div>
    );
};

const TextPreview = ({ byteGroups, onByteClick, selectedByte }) => {
    const renderSymbol = (group, firstByteIndex) => {
        const output = [
            <Item
                key={ firstByteIndex }
                index={ firstByteIndex }
                charCode={ getChar(group) }
                onClick={ onByteClick }
                isSelected={ selectedByte === firstByteIndex }
            />
        ];
        for (let i = 1; i < group.length; i++) {
            const innerByteIndex = firstByteIndex + i;
            output.push(
                <Item
                    key={ `${ firstByteIndex }-${ i }` }
                    empty={ true }
                    index={ innerByteIndex }
                    onClick={ onByteClick }
                    isSelected={ selectedByte === innerByteIndex }
                />
            );
        }
        return output;
    };

    return byteGroups.map((group) => renderSymbol(group.bytes, group.firstByteIndex));
};

export default TextPreview;