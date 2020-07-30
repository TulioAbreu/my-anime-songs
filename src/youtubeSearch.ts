import ytsr from "ytsr";
import Ora from "ora";
import YtsrResponse from "./types/ytsr";
import Song from "./types/song";

async function getYoutubeSong(keyword: string): Promise<Song | undefined> {
    const response = await ytsr(keyword, {
        limit: 3,
    });

    if (!response.items.length) {
        return;
    }

    const { link } = response.items[0] as YtsrResponse;
    return {
        name: keyword,
        url: link,
    };
}

export async function getYoutubeSongs(keywords: string[]): Promise<Song[]> {
    const songs: Song[] = [];
    let i = 0;
    const spinner = Ora("Searching songs at Youtube");

    spinner.start();
    for (const keyword of keywords) {
        const song = await getYoutubeSong(keyword);

        const percentage = (100 * i)/keywords.length;
        spinner.prefixText = `${percentage.toFixed(1)}%`;
        i += 1;

        if (!song) {
            continue;
        }

        songs.push(song);
    }
    spinner.succeed();

    return songs;
}
