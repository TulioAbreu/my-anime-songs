import {
    getAnimeUrl,
    getProfileUrl,
    getUserAnimeUrlsFromPage,
} from  "./index";
import * as fs from "fs";

function getUserName(): string {
    return "user12345678910";
}

function getAnimeId(): string {
    return "1232132132";
}

function getSampleHtml(): string {
    return fs.readFileSync(__dirname + "/testHtml.html", { encoding: "utf8" });
}

test("get user animelist url", () => {
    const USER_PROFILE = getUserName();
    const url = getProfileUrl(USER_PROFILE);
    expect(url).toBe(`https://myanimelist.net/animelist/${USER_PROFILE}`);
});

test("get anime url", () => {
    const ANIME_ID = getAnimeId();
    const url = getAnimeUrl(ANIME_ID);
    expect(url).toBe(`https://myanimelist.net/anime/${ANIME_ID}`);
});

test("get anime urls from sample HTML", () => {
    const sampleHtml = getSampleHtml();
    const urlsList = [
        "https://myanimelist.net/anime/38084",
        "https://myanimelist.net/anime/40046",
    ];
    const extractedUrls = getUserAnimeUrlsFromPage(sampleHtml);
    expect(extractedUrls).toStrictEqual(urlsList);
});
