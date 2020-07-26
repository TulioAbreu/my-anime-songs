import * as fs from "fs";
import sleep from "../utils/sleep";
import saveJSON from "../utils/save-json";
import Ora from "ora";
import { getAnimeSongs } from "../../myAnimeList";
import Chalk from "chalk";
import config from "../../config";

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
        await sleep(TIME_BETWEEN_REQUESTS);

        const percentage = (100 * i)/userAnimeList.length;
        spinner.prefixText = `${percentage.toFixed(1)}%`
        i += 1;
    }
    spinner.succeed();

    cacheSongList(username, animeSongs);
    return animeSongs;
}