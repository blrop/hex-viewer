import classNames from 'classnames';

import styles from './HexView.module.scss';

function Item({ index, value, onClick, isSelected, empty }) {
    function toHex(number) {
        return (number < 16 ? '0' : '') + number.toString(16);
    }

    const handleClick = () => onClick(index);

    return (
        <div
            onClick={ handleClick }
            className={
                classNames(styles.value, {
                    [styles['value--empty']]: empty,
                    [styles['value--selected']]: isSelected,
                })
            }
        >
            { toHex(value) }
        </div>
    );
}

function HexView({ byteGroups, onByteClick, selectedByte }) {
    const renderByte = (group, firstByteIndex) => {
        const output = [
            <Item
                key={ firstByteIndex }
                index={ firstByteIndex }
                value={ group[0] }
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
                    value={ group[i] }
                    onClick={ onByteClick }
                    isSelected={ selectedByte === innerByteIndex }
                />
            );
        }
        return output;

    };

    return byteGroups.map((group) => renderByte(group.bytes, group.firstByteIndex));
}

export default HexView;