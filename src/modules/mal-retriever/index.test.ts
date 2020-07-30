import {
    getAnimeUrl,
    getProfileUrl
} from  "./index";

function getUserName(): string {
    return "user12345678910";
}

function getAnimeId(): string {
    return "1232132132";
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

