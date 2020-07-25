import Prompts from "prompts";
import Chalk from "chalk";
import Ora from "ora";
import * as fs from "fs";

import { getUserAnimelist, getAnimeSongs } from './myAnimeList';
import sleep from "./sleep";
import { parseSongToKeyword } from "./keywords";

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

function saveJSON(path: string, data: any) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

async function getSongList(username: string, userAnimeList: string[]): Promise<string[]> {
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
        await sleep(1000);

        const percentage = (100 * i)/userAnimeList.length;
        spinner.prefixText = `${percentage.toFixed(1)}%`
        i += 1;
    }
    spinner.succeed();

    cacheSongList(username, animeSongs);
    return animeSongs;
}

async function main() {
    const { username } = await Prompts({
        type: "text",
        name: "username",
        message: "What is your MyAnimeList username?",
    });

    const userAnimeList = await getUserAnimelist(username);
    if (!userAnimeList.length) {
        console.error(`❌ ${Chalk.red("ERROR")} User has empty list or does not exist.`);
        return;
    }

    const animeSongs = await getSongList(username, userAnimeList);
    const youtubeKeywords = animeSongs.map((animeSong: string) => {
        return parseSongToKeyword(animeSong);
    });

    console.log(youtubeKeywords);
}

main();
