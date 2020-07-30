import { getPageText } from "../page-retriever";
import { JSDOM } from "jsdom";

function getProfileUrl(username: string): string {
    return `https://myanimelist.net/animelist/${username}`;
}

function getAnimeUrl(animeId: string): string {
    return `https://myanimelist.net/anime/${animeId}`;
}

async function getUserAnimelist(username: string): Promise<string[]> {
    const animeUrls: string[] = [];
    const malProfileUrl: string = getProfileUrl(username);

    const page = await getPageText(malProfileUrl);
    if (!page) {
        return [];
    }

    const rawArr: RegExpMatchArray|null = page.htmlText.match(/anime_id&quot;:(.*?),/g);
    if (!rawArr) {
        return animeUrls;
    }

    rawArr.forEach(rawResult => {
        const animeId: string = rawResult.split("&quot;:")[1].slice(0, -1);

        animeUrls.push(getAnimeUrl(animeId));
    });

    return animeUrls;
}

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
    getUserAnimelist
};
