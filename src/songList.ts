import * as fs from "fs";
import sleep from "./sleep";
import { saveJSON } from "./utils";
import Ora from "ora";
import { getAnimeSongs } from './myAnimeList';
import Chalk from "chalk";

const REQUEST_INTERVAL = 3000;

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

export async function getSongList(username: string, userAnimeList: string[]): Promise<string[]> {
    if (isSongListCached(username)) {
        return getCachedSongList(username);
    }

    const spinner = Ora("Downloading animes song list");
    let animeSongs: string[] = [];
    spinner.start();
    let i = 0;
    for (const anime of userAnimeList) {
        (await getAnimeSongs(anime)).map((song) => {
            animeSongs.push(song);
        });
        await sleep(REQUEST_INTERVAL);

        const percentage = (100 * i)/userAnimeList.length;
        spinner.prefixText = `${percentage.toFixed(1)}%`
        i += 1;
    }
    spinner.succeed();

    cacheSongList(username, animeSongs);
    return animeSongs;
}