import { VIEW_HEX, VIEW_TEXT } from "../../../common/constants";
import { byteGroupToChar } from "../../../common/tools";
import classNames from "classnames";
import styles from "./Item.module.scss";

function Item({ viewType, index, onClick, isSelected, isSecondarySelected, bytes, indexInGroup }) {
    function toHex(number) {
        return number.toString(16).padStart(2, '0');
    }

    const handleClick = () => onClick(index);

    let valueToShow;
    if (viewType === VIEW_HEX) {
        valueToShow = toHex(bytes[indexInGroup]);
    } else if (viewType === VIEW_TEXT) {
        valueToShow = indexInGroup === 0 ? byteGroupToChar(bytes) : null;
    } else {
        return null;
    }

    return (
        <div
            onClick={ handleClick }
            className={
                classNames(styles.value, {
                    [styles['value--selected']]: isSelected,
                    [styles['value--secondary-selected']]: isSecondarySelected,
                })
            }
        >
            { valueToShow }
        </div>
    );
}

export default Item;
