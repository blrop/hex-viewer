import styles from './TextPreview.module.scss';
import { getChar, getSymbolLength, makeBytesIterator } from "../../common/tools";

const TextPreview = ({ bytes }) => {
    const renderSymbol = (charCode, index) => (
        <div key={index}>{String.fromCharCode(charCode)}</div>
    );

    const bytesIterator = makeBytesIterator(bytes);
    const output = [];
    let result = bytesIterator.next();
    let index = 0;
    while (!result.done) {
        const byte = result.value;
        const symbolLength = getSymbolLength(byte);
        const bytesOfSymbol = [byte];
        for (let i = 1; i < symbolLength; i++) {
            result = bytesIterator.next();
            index++;

            bytesOfSymbol.push(result.value);
            if (result.done) {
                break;
            }
        }
        output.push(renderSymbol(getChar(bytesOfSymbol), index));

        result = bytesIterator.next()
        index++;
    }

    return (
        <div className={styles.preview}>
            {output}
        </div>
    );
};

export default TextPreview;