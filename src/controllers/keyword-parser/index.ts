function parseSongToKeyword(str: string): string {
    const parsingSteps = getParsingSteps();
    const parsedStr = parseStr(str, parsingSteps);
    return parsedStr;
}

function parseStr(str: string, steps: Function[]): string {
    let parsedStr = str;
    for (const step of steps) {
        parsedStr = step(parsedStr);
    }
    return parsedStr.trim();
}

function getParsingSteps(): Function[] {
    return [
        removeEpisodesTag,
        removeNumberTag,
        removeSpecialChars,
    ];
}

function removeSpecialChars(str: string): string {
    const forbiddenChars = "'\"():;[]{}";
    let newStr = "";
    for (let i = 0; i < str.length; ++i) {
        if (forbiddenChars.includes(str[i])) {
            continue;
        }
        newStr += str[i];
    }
    return newStr;
}

function removeNumberTag(str: string): string {
    return str.replace(/#[0-9]+(.*)?\:/g, "");
}

function removeEpisodesTag(str: string): string {
    return str.replace(/\(ep(s)?(.*)?\)/g, "");
}

export  {
    parseSongToKeyword,
    parseStr,
    getParsingSteps,
    removeSpecialChars,
    removeNumberTag,
    removeEpisodesTag,
}
