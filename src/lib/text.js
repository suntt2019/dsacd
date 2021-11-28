export function GetLowerText(content, point) {
    let lower = point;
    let spaceCount = 0;
    while (lower >= 0 && lower > point - 50 && spaceCount < 4) {
        if (content[lower] === ' ') {
            spaceCount++;
        }
        lower--;
    }
    return content.substring(lower+1, point);
}

export function GetBodyText(content, point, length) {
    return content.substr(point, length);
}

// TODO: fix bug when the word contains the last char in the file.
export function GetUpperText(content, pointAfterWord) {
    let upper = pointAfterWord;
    let spaceCount = 0;
    while (upper < content.length && upper < pointAfterWord + 50 && spaceCount < 3) {
        if (content[upper] === ' ') {
            spaceCount++;
        }
        upper++;
    }
    return content.substring(pointAfterWord, upper);
}
