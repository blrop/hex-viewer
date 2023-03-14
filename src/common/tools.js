const B_1000_0000 = 128;
const B_1100_0000 = 192;
const B_1110_0000 = 224;
const B_1111_0000 = 240;
const B_1111_1000 = 248;

const B_0000_0011 = 3;
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

export const getChar = (bytes) => {
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

export const getCharFromTwoBytes = (byte1, byte2) => {
    const cleanByte1 = byte1 & B_0001_1111;
    const cleanByte2 = byte2 & B_0011_1111;
    const part1 = cleanByte1 >> 2; // take only first 3 bits (rest 2 bits + 6 bits in next byte are parts of the second byte)
    const part2 = ((cleanByte1 & B_0000_0011) << 6) + cleanByte2; // take rest 2 bits, move them to the byte's left most position and add rest 6 bits

    return String.fromCodePoint((part1 << 8) + part2);
};