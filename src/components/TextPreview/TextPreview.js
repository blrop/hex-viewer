import styles from './TextPreview.module.scss';
import { getChar, getSymbolLength, makeBytesIterator } from "../../common/tools";

const TextPreview = ({ bytes }) => {
    const renderSymbol = (charCode) => (
        <div>{String.fromCharCode(charCode)}</div>
    );

    const bytesIterator = makeBytesIterator(bytes);
    const output = [];
    while (!bytesIterator.done) {
        const byte = bytesIterator.next();
        const symbolLength = getSymbolLength(byte);
        const bytesOfSymbol = [byte];
        if (symbolLength > 1) {
            for (let i = 0; i < symbolLength; i++) {
                bytesOfSymbol.push(bytesIterator.next());
                if (bytesIterator.done) {
                    break;
                }
            }
        }
        output.push(renderSymbol(getChar(bytesOfSymbol)));
    }

    return (
        <div className={styles.preview}>
            {output}
        </div>
    );
};

export default TextPreview;