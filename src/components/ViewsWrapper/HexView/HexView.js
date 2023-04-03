import classNames from 'classnames';

import styles from './HexView.module.scss';

function Item({ index, value, onClick, isSelected, isEmpty, isSecondarySelected }) {
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

function HexView({ byteGroups, onByteClick, selectedByteIndex }) {
    const renderByte = (group, firstByteIndex) => {
        const isSecondarySelected = (currentIndex) =>
            firstByteIndex <= selectedByteIndex  && selectedByteIndex < (firstByteIndex + group.length) &&
            selectedByteIndex !== currentIndex;

        const output = [
            <Item
                key={ firstByteIndex }
                index={ firstByteIndex }
                value={ group[0] }
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
                    value={ group[i] }
                    onClick={ onByteClick }
                    isSelected={ selectedByteIndex === innerByteIndex }
                    isEmpty={ true }
                    isSecondarySelected={ isSecondarySelected(innerByteIndex) }
                />
            );
        }
        return output;
    };

    return byteGroups.map((group) => renderByte(group.bytes, group.firstByteIndex));
}

export default HexView;