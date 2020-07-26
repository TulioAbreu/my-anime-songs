import {
    parseSongToKeyword,
    removeSpecialChars,
    removeNumberTag,
    removeEpisodesTag,
} from "./";

function getOpenings() {
    return [
        '#01: "Haruka Mirai (ハルカミライ)" by Kankaku Piero (感覚ピエロ) (eps 1-13)',
        '#02: "PAiNT it BLACK" by BiSH (eps 14-27)',
        '#03: "Black Rover" by Vickeblanka (eps 28-39)',
        '#04: "Guess Who Is Back" by Kumi Koda (倖田來未) (eps 40-51)',
        '#05: "Gamushara" by Miyuna (ガムシャラ) (eps 52-64)',
        '#06: "Rakugaki Page" (落書きペイジ) by Kankaku Piero (感覚ピエロ) (eps 65-76)',
        '#07: "JUSTadICE" by Seiko Oomori (大森靖子) (eps 77-94)',
        '#08: "sky＆blue" by GIRLFRIEND (eps 95-102)',
        '#09: "RiGHT NOW" by EMPiRE (eps 103-115)',
        '#10: "Black Catcher" by Vickeblanka (eps 116-128)',
    ];
}

test("Removing episode tags", () => {
    const parsedOpenings = getOpenings().map(removeEpisodesTag);
    expect(parsedOpenings).toStrictEqual([
        '#01: "Haruka Mirai (ハルカミライ)" by Kankaku Piero (感覚ピエロ) ',
        '#02: "PAiNT it BLACK" by BiSH ',
        '#03: "Black Rover" by Vickeblanka ',
        '#04: "Guess Who Is Back" by Kumi Koda (倖田來未) ',
        '#05: "Gamushara" by Miyuna (ガムシャラ) ',
        '#06: "Rakugaki Page" (落書きペイジ) by Kankaku Piero (感覚ピエロ) ',
        '#07: "JUSTadICE" by Seiko Oomori (大森靖子) ',
        '#08: "sky＆blue" by GIRLFRIEND ',
        '#09: "RiGHT NOW" by EMPiRE ',
        '#10: "Black Catcher" by Vickeblanka ',
    ]);
});

test("Removing number tag", () => {
    const parsedOpenings = getOpenings().map(removeNumberTag);
    expect(parsedOpenings).toStrictEqual([
        ' "Haruka Mirai (ハルカミライ)" by Kankaku Piero (感覚ピエロ) (eps 1-13)',
        ' "PAiNT it BLACK" by BiSH (eps 14-27)',
        ' "Black Rover" by Vickeblanka (eps 28-39)',
        ' "Guess Who Is Back" by Kumi Koda (倖田來未) (eps 40-51)',
        ' "Gamushara" by Miyuna (ガムシャラ) (eps 52-64)',
        ' "Rakugaki Page" (落書きペイジ) by Kankaku Piero (感覚ピエロ) (eps 65-76)',
        ' "JUSTadICE" by Seiko Oomori (大森靖子) (eps 77-94)',
        ' "sky＆blue" by GIRLFRIEND (eps 95-102)',
        ' "RiGHT NOW" by EMPiRE (eps 103-115)',
        ' "Black Catcher" by Vickeblanka (eps 116-128)',
    ]);
});

test ("Removing special characters", () => {
    const parsedOpenings = getOpenings().map(removeSpecialChars);
    expect(parsedOpenings).toStrictEqual([
        '#01 Haruka Mirai ハルカミライ by Kankaku Piero 感覚ピエロ eps 1-13',
        '#02 PAiNT it BLACK by BiSH eps 14-27',
        '#03 Black Rover by Vickeblanka eps 28-39',
        '#04 Guess Who Is Back by Kumi Koda 倖田來未 eps 40-51',
        '#05 Gamushara by Miyuna ガムシャラ eps 52-64',
        '#06 Rakugaki Page 落書きペイジ by Kankaku Piero 感覚ピエロ eps 65-76',
        '#07 JUSTadICE by Seiko Oomori 大森靖子 eps 77-94',
        '#08 sky＆blue by GIRLFRIEND eps 95-102',
        '#09 RiGHT NOW by EMPiRE eps 103-115',
        '#10 Black Catcher by Vickeblanka eps 116-128',
    ]);
});

test("Complete parsing", () => {
    const parsedOpenings = getOpenings().map(parseSongToKeyword);
    expect(parsedOpenings).toStrictEqual([
        'Haruka Mirai ハルカミライ by Kankaku Piero 感覚ピエロ',
        'PAiNT it BLACK by BiSH',
        'Black Rover by Vickeblanka',
        'Guess Who Is Back by Kumi Koda 倖田來未',
        'Gamushara by Miyuna ガムシャラ',
        'Rakugaki Page 落書きペイジ by Kankaku Piero 感覚ピエロ',
        'JUSTadICE by Seiko Oomori 大森靖子',
        'sky＆blue by GIRLFRIEND',
        'RiGHT NOW by EMPiRE',
        'Black Catcher by Vickeblanka',
    ]);
});
