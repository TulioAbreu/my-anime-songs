import ytsr from "ytsr";

interface YtsrItem {
    link: string,
}

interface Song {
    name: string,
    url: string,
}

async function getYoutubeSong(keyword: string): Promise<Song | undefined> {
    const response = await ytsr(keyword, {
        limit: 3,
    });

    if (!response.items.length) {
        return;
    }

    const { link } = response.items[0] as YtsrItem;
    return {
        name: keyword,
        url: link,
    }
}

export async function getYoutubeSongs(keywords: string[]): Promise<Song[]> {
    let songs: Song[] = [];

    for (const keyword of keywords) {
        const song = await getYoutubeSong(keyword);

        if (!song) {
            continue;
        }

        songs.push(song);
    }

    return songs;
}
