const base64Table = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
    'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'
]

function base64DecodeChar(num) {
    if ('A'.charCodeAt(0) <= num && num <= 'Z'.charCodeAt(0)) {
        return num - 'A'.charCodeAt(0);
    }
    if ('a'.charCodeAt(0) <= num && num <= 'z'.charCodeAt(0)) {
        return num - 'a'.charCodeAt(0) + 26;
    }
    if ('0'.charCodeAt(0) <= num && num <= '9'.charCodeAt(0)) {
        return num - '0'.charCodeAt(0) + 52;
    }
    if(num === '+'.charCodeAt(0)) {
        return 62;
    }
    if(num === '/'.charCodeAt(0)) {
        return 63;
    }
    if(num === '='.charCodeAt(0)) {
        return 0;
    }
    return -1;
}

export class base64 {
    static Encode(array) {
        let arr = Array.from(array);
        let ret = '';
        let emptyCount = arr.length % 3 !== 0 ? 3 - arr.length % 3 : 0;
        for (let i = 0; i < emptyCount; i++) {
            arr.push(0);
        }
        for (let i = 0; i < arr.length / 3; i++) {
            const buf = (arr[i * 3] << 16) + (arr[i * 3 + 1] << 8) + arr[i * 3 + 2];
            for (let j = 3; j >= 0; j--) {
                if (i === arr.length / 3 - 1 && j < emptyCount) {
                    ret += '=';
                    continue;
                }
                ret += base64Table[(buf >> (j * 6)) % 64];
            }
        }
        return ret;
    }

    static Decode(str) {
        let string = str;
        let arr = [];
        let ret = [];
        let emptyCount = 0;
        for(let i in string) {
            if(str[i] === '=') {
                emptyCount++;
            }
            const base64Char = base64DecodeChar(str.charCodeAt(i));
            if(base64Char === -1) {
                return null;
            } else {
                arr.push(base64Char);
            }
        }
        if(emptyCount >= 3) {
            return null;
        }
        for(let i=0; i<Math.ceil(arr.length/4); i++) {
            const buf = (arr[i * 4] << 18) + (arr[i * 4 + 1] << 12) + (arr[i * 4 + 2] << 6) + arr[i * 4 + 3];
            for (let j = 2; j >= 0; j--) {
                ret.push((buf >> (j * 8)) % 256);
            }
        }
        for(let i=0;i<emptyCount;i++) {
            ret.pop();
        }
        return ret;
    }
}

export function ZeroOneStringToArr(string) {
    let str = string;
    let emptyCount = 8 - str.length % 8;
    let ret = []
    str = '1' + str;
    for (let i = 0; i < emptyCount - 1; i++) {
        str = '0' + str;
    }
    let buf = 0, cnt = 0;
    for (let i in str) {
        buf = buf << 1;
        switch (str[i]) {
            case '0':
                break;
            case '1':
                buf++;
                break;
            default:
                return null;
        }
        cnt++;
        if (cnt === 8) {
            ret.push(buf);
            cnt = 0;
            buf = 0;
        }
    }
    return ret;
}

export function ArrToZeroOneString(arr) {
    let zeroOneArr = [];
    for(let i in arr) {
        for(let j=7;j>=0;j--) {
            zeroOneArr.push((arr[i]>>j)%2);
        }
    }
    let i=0;
    let ret = [];
    while(zeroOneArr[i] === 0) {
        i++;
    }
    if(zeroOneArr[i] !== 1) {
        return null;
    }
    i++; // skip 1
    while(i<zeroOneArr.length) {
        ret += zeroOneArr[i].toString();
        i++;
    }
    return ret;
}
