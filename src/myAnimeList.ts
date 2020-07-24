import { Page, getPageText } from './fetchHtml';
import { JSDOM } from 'jsdom';

function getProfileUrl(username: string): string {
    return `https://myanimelist.net/animelist/${username}`;
}

function getAnimeUrl(animeId: string): string {
    return `https://myanimelist.net/anime/${animeId}`;
}

async function getUserAnimelist(username: string): Promise<Array<string>> {
    const USER_NOT_FOUND_TEXT: string = 'Could not find user';

    let animeUrls: Array<string> = [];
    const malProfileUrl: string = getProfileUrl(username);

    const page: Page = await getPageText(malProfileUrl);
    if (page.status.startsWith("4")) {
        console.error("Profile not found.");
        return [];
    } else if (page.status.startsWith("5")) {
        console.error("You are currently blocked from MAL.");
        return []
    } else if (page.status !== "200") {
        console.error(`HTML error ${page.status}`);
        return [];
    }

    const rawArr: RegExpMatchArray|null = page.htmlText.match(/anime_id&quot;:(.*?),/g);
    if (!rawArr) {
        return animeUrls;
    }

    rawArr.forEach(rawResult => {
        let animeId: string = rawResult.split('&quot;:')[1].slice(0, -1);

        animeUrls.push(getAnimeUrl(animeId));
    });

    return animeUrls;
}

async function getAnimeSongs(malAnimeUrl: string): Promise<Array<string>> {
    const animePageHtml: Page = await getPageText(malAnimeUrl);
    const animePageDom: JSDOM = new JSDOM(animePageHtml.htmlText);

    const songs = animePageDom.window.document.getElementsByClassName('theme-song');

    let rawAnimeSongNames: Array<string> = [];
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
