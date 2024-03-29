const B_1000_0000 = 128;
const B_1100_0000 = 192;
const B_1110_0000 = 224;
const B_1111_0000 = 240;
const B_1111_1000 = 248;

const B_0000_0111 = 7;
const B_0000_1111 = 15;
const B_0001_1111 = 31;
const B_0011_1111 = 63;
const B_0111_1111 = 127;

export const makeBytesIterator = function* (bytes) {
    for (let i = 0; i < bytes.length; i++) {
        yield bytes[i];
    }
};

export const getSymbolLength = (byte) => {
    if ((byte & B_1000_0000) === 0) {
        return 1;
    }
    if ((byte & B_1110_0000) === B_1100_0000) {
        return 2;
    }
    if ((byte & B_1111_0000) === B_1110_0000) {
        return 3;
    }
    if ((byte & B_1111_1000) === B_1111_0000) {
        return 4;
    }
};

const getChar = (bytes) => {
    const lengthToMask = {
        1: B_0111_1111,
        2: B_0001_1111,
        3: B_0000_1111,
        4: B_0000_0111,
    };
    const indexToShift = {
        1: 0,
        2: 6,
        3: 12,
        4: 18,
    };

    const firstValue = bytes[0] & lengthToMask[bytes.length];
    let result = firstValue << indexToShift[bytes.length];

    for (let i = 1; i < bytes.length; i++) {
        const value = bytes[i] & B_0011_1111;
        result += value << indexToShift[bytes.length - i];
    }

    return result;
}

export const byteGroupToChar = (bytes) => {
    const charCode = getChar(bytes);
    if (charCode < 32) {
        return '.';
    }
    return String.fromCharCode(charCode);
};

export const generateByteGroups = (bytes, unicodeMode) => {
    const bytesIterator = makeBytesIterator(bytes);
    const output = [];

    let result = bytesIterator.next();
    let index = 0;
    while (!result.done) {
        const byte = result.value;
        const symbolLength = unicodeMode ? getSymbolLength(byte) : 1;
        const bytesOfSymbol = [byte];
        const firstByteIndex = index;

        for (let i = 1; i < symbolLength; i++) {
            result = bytesIterator.next();
            index++;

            if (result.done) {
                break;
            }
            bytesOfSymbol.push(result.value);
        }

        output.push({ bytes: bytesOfSymbol, firstByteIndex });

        result = bytesIterator.next()
        index++;
    }

    return output;
}

export const numberTo8BitString = (number) => {
    if (!number) {
        return '';
    }
    const binaryString = number.toString(2).padStart(8, '0');
    return binaryString.slice(0, 4) + ' ' + binaryString.slice(4);
};

export const fileSizeToUnits = (size) => {
    const kb = 1024;
    const mb = kb * 1024;
    const gb = mb * 1024;

    if (size > gb) {
        return `${ Math.round(size / gb) } Gb`;
    }
    if (size > mb) {
        return `${ Math.round(size / mb) } Mb`;
    }
    if (size > kb) {
        return `${ Math.round(size / kb) } Kb`;
    }

    return `${ size } bytes`;
};
