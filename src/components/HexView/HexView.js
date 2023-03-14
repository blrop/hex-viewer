import styles from './HexView.module.scss';

function HexView({ bytes }) {
    return (
        <div className={styles.hexView}>
            {[...bytes]
                .map((value, index) =>
                    <div key={index} className="hex-view__value">{toHex(value)}</div>
                )}
        </div>
    );

    function toHex(number) {
        return (number < 16 ? '0' : '') + number.toString(16);
    }
}

export default HexView;