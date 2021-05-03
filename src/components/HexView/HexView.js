import './HexView.scss';

function HexView({ values }) {
    return <div className="hex-view">
        {[...values]
            .map((value, index) =>
                <div key={index} className="hex-view__value">{toHex(value)}</div>
            )}
    </div>;

    function toHex(number) {
        return (number < 16 ? '0' : '') + number.toString(16);
    }
}

export default HexView;