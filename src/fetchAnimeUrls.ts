import { getPageText } from './fetchHtml';

function getMalProfileUrl(username: string): string {
    return `https://myanimelist.net/animelist/${username}`;
}

function getMalAnimeUrl(animeId: string): string {
    return `https://myanimelist.net/anime/${animeId}`;
}

async function getMalAnimeUrlList(username: string): Promise<string[]> {
    const USER_NOT_FOUND_TEXT: string = 'Could not find user';

    let animeUrls: string[] = [];
    const malProfileUrl: string = getMalProfileUrl(username);
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

        animeUrls.push(getMalAnimeUrl(animeId));
    });

    return animeUrls;
}

export {
    getMalAnimeUrlList
};