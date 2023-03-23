import classNames from 'classnames';

import styles from './HexView.module.scss';

function Item({ index, value, onClick, isSelected }) {
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
                })
            }
        >
            { toHex(value) }
        </div>
    );
}

function HexView({ bytes, onByteClick, selectedByte }) {
    return [...bytes].map((value, index) =>
        <Item
            key={ index }
            index={ index }
            value={ value }
            onClick={ onByteClick }
            isSelected={ selectedByte === index }
        />
    );
}

export default HexView;