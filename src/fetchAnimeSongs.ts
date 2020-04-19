import { getPageText } from './fetchHtml';
import { JSDOM } from 'jsdom';

async function getMalRawAnimeSongs(malAnimeUrl: string): Promise<string[]> {
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
    getMalRawAnimeSongs
};
