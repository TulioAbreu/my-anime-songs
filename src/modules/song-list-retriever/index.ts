import * as fs from "fs";
import sleep from "../utils/sleep";
import saveJSON from "../utils/save-json";
import { getAnimeSongs } from "../mal-retriever";
import Chalk from "chalk";
import config from "../../config";
import { ProgressCallbacks } from "../../types/progress-callbacks";

const TIME_BETWEEN_REQUESTS = config["timeBetweenRequests"];

function isSongListCached(username: string): boolean {
    if (!fs.existsSync("./cache")) {
        fs.mkdir("./cache", (err) => {
            if (err) {
                console.error(`❌ ${Chalk.red("ERROR")}  Failed to create cache dir.`);
            }
        });
    }

    return fs.existsSync(`./cache/${username}.json`);
}

function getCachedSongList(username: string) {
    const fileData = fs.readFileSync(`./cache/${username}.json`, "utf-8");
    return JSON.parse(fileData);
}

function cacheSongList(username: string, songList: string[]) {
    console.log(`${Chalk.green("INFO")} Saving userlist songs to ./${username}.json file.`);
    saveJSON(`./cache/${username}.json`, songList);
}

export async function getSongList(username: string, userAnimeList: string[], progress?: ProgressCallbacks): Promise<string[]> {
    if (isSongListCached(username)) {
        return getCachedSongList(username);
    }

    const animeSongs: string[] = [];
    progress?.onStart();
    for (const anime of userAnimeList) {
        (await getAnimeSongs(anime)).map((song) => {
            animeSongs.push(song);
        });
        await sleep(TIME_BETWEEN_REQUESTS);

        progress?.onProgress();
    }
    progress?.onFinish();

    cacheSongList(username, animeSongs);
    return animeSongs;
}
