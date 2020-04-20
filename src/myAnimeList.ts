import { getPageText } from './fetchHtml';
import { JSDOM } from 'jsdom';

function getProfileUrl(username: string): string {
    return `https://myanimelist.net/animelist/${username}`;
}

function getAnimeUrl(animeId: string): string {
    return `https://myanimelist.net/anime/${animeId}`;
}

async function getUserAnimelist(username: string): Promise<string[]> {
    const USER_NOT_FOUND_TEXT: string = 'Could not find user';

    let animeUrls: string[] = [];
    const malProfileUrl: string = getProfileUrl(username);
    const htmlPage: string = await getPageText(malProfileUrl);
    
    if (htmlPage.indexOf(USER_NOT_FOUND_TEXT) >= 0) {
        console.error('MAL user profile not found.');
        return animeUrls;
    }

    const rawArr: RegExpMatchArray|null = htmlPage.match(/anime_id&quot;:(.*?),/g);
    if (!rawArr) {
        console.error('Failed parsing anime_id regex matches.');
        return animeUrls;
    }

    rawArr.forEach(rawResult => {
        let animeId: string = rawResult.split('&quot;:')[1].slice(0, -1);

        animeUrls.push(getAnimeUrl(animeId));
    });

    return animeUrls;
}

async function getAnimeSongs(malAnimeUrl: string): Promise<string[]> {
    const animePageHtml: string = await getPageText(malAnimeUrl);
    const animePageDom: JSDOM = new JSDOM(animePageHtml);

    const songs = animePageDom.window.document.getElementsByClassName('theme-song');

    let rawAnimeSongNames: string[] = [];
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
