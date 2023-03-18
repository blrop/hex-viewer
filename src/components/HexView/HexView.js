import classNames from 'classnames';

import styles from './HexView.module.scss';

function Item({ index, value, onClick, isSelected, isActiveView }) {
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
                    [styles['active-view']]: isActiveView,
                })
            }
        >
            { toHex(value) }
        </div>
    );
}

function HexView({ bytes, onByteClick, selectedByte, isActiveView }) {
    return [...bytes].map((value, index) =>
        <Item
            key={ index }
            index={ index }
            value={ value }
            onClick={ onByteClick }
            isSelected={ selectedByte === index }
            isActiveView={ isActiveView }
        />
    );
}

export default HexView;