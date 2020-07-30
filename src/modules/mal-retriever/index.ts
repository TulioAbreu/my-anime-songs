import { getPageText } from "../page-retriever";
import { JSDOM } from "jsdom";

type Maybe<T> = T | null;

function getProfileUrl(username: string): string {
    return `https://myanimdselist.net/animelist/${username}`;
}

function getAnimeUrl(animeId: string): string {
    return `https://myanimelist.net/anime/${animeId}`;
}

function getUserAnimeUrlsFromPage(pageHtmlText: string): string[] {
    if (!pageHtmlText || !pageHtmlText.length) {
        return [];
    }

    const ANIME_ID_REGEX = /anime_id&quot;:(.*?),/g;

    const rawAnimeIds: Maybe<RegExpMatchArray> = pageHtmlText.match(ANIME_ID_REGEX);
    if (!rawAnimeIds) {
        return [];
    }

    return rawAnimeIds.map((rawAnimeId: string) => {
        const animeId = rawAnimeId.split("&quot;:").pop();
        if (!animeId) {
            return "";
        } else {
            return getAnimeUrl(animeId.slice(0, -1));
        }
    });
}

async function getUserAnimelist(username: string): Promise<string[]> {
    const malProfileUrl: string = getProfileUrl(username);

    const page = await getPageText(malProfileUrl);
    if (!page) {
        return [];
    }

    return getUserAnimeUrlsFromPage(page.htmlText);
}

// TODO: Split function into page retrieve + regex searches
async function getAnimeSongs(malAnimeUrl: string): Promise<string[]> {
    const animePageHtml = await getPageText(malAnimeUrl);
    if (!animePageHtml) {
        return [];
    }

    const animePageDom: JSDOM = new JSDOM(animePageHtml.htmlText);

    const songs = animePageDom.window.document.getElementsByClassName("theme-song");

    const rawAnimeSongNames: string[] = [];
    for (let i = 0; i < songs.length; ++i) {
        const currentSong: Element|null = songs.item(i);

        if (!currentSong) { continue; }
        if (!currentSong.textContent) { continue; }

        rawAnimeSongNames.push(currentSong.textContent);
    }

    return rawAnimeSongNames;
}

export {
    getAnimeSongs,
    getUserAnimelist,
    getUserAnimeUrlsFromPage,
    getAnimeUrl,
    getProfileUrl,
};
