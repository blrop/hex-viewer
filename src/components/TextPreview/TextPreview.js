import classNames from 'classnames';

import { getChar, getSymbolLength, makeBytesIterator } from "../../common/tools";

import styles from './TextPreview.module.scss';

const Item = ({ empty, index, charCode, onClick, isSelected, isActiveView }) => {
    const handleClick = () => onClick(index);

    return (
        <div
            data-index={ index }
            className={
                classNames(styles.value, {
                    [styles['value--empty']]: empty,
                    [styles['value--selected']]: isSelected,
                    [styles['active-view']]: isActiveView,
                })
            }
            onClick={ handleClick }
        >
            { charCode && String.fromCharCode(charCode) }
        </div>
    );
};

const TextPreview = ({ bytes, unicodeMode, onByteClick, selectedByte, isActiveView }) => {
    const renderSymbol = (charCode, index, bytesNumber) => {
        const output = [
            <Item
                key={ index }
                index={ index }
                charCode={ charCode }
                onClick={ onByteClick }
                isSelected={ selectedByte === index }
                isActiveView={ isActiveView }
            />
        ];
        for (let i = 1; i < bytesNumber; i++) {
            output.push(
                <Item
                    key={`${ index }-${ i }`}
                    empty={ true }
                    index={ index }
                    onClick={ onByteClick }
                    isSelected={ selectedByte === index }
                    isActiveView={ isActiveView }
                />
            );
        }
        return output;
    };

    const bytesIterator = makeBytesIterator(bytes);
    const output = [];
    let result = bytesIterator.next();
    let index = 0;
    while (!result.done) {
        const byte = result.value;
        const symbolLength = unicodeMode ? getSymbolLength(byte) : 1;
        const bytesOfSymbol = [byte];

        for (let i = 1; i < symbolLength; i++) {
            result = bytesIterator.next();
            index++;

            bytesOfSymbol.push(result.value);
            if (result.done) {
                break;
            }
        }

        output.push(renderSymbol(getChar(bytesOfSymbol), index, bytesOfSymbol.length));

        result = bytesIterator.next()
        index++;
    }

    return output;
};

export default TextPreview;