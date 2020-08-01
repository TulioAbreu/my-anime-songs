import ytsr from "ytsr";
import YtsrResponse from "./types/ytsr";
import Song from "./types/song";
import { ProgressCallbacks } from "./types/progress-callbacks";

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

export async function getYoutubeSongs(keywords: string[], progressCallbacks: ProgressCallbacks): Promise<Song[]> {
    const songs: Song[] = [];

    progressCallbacks?.onStart();
    for (const keyword of keywords) {
        const song = await getYoutubeSong(keyword);
        progressCallbacks?.onProgress();

        if (!song) {
            continue;
        }

        songs.push(song);
    }
    progressCallbacks?.onFinish();

    return songs;
}
