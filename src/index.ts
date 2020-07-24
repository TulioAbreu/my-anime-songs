import Prompts from "prompts";
import Chalk from "chalk";
import Ora from "ora";
import * as fs from "fs";

import { getUserAnimelist, getAnimeSongs } from './myAnimeList';
import sleep from "./sleep";

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

    // TODO: Cache user json

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

    console.log(`[INFO] Saving userlist songs to ./${username}.json file.`);
    fs.writeFileSync(`./${username}.json`, JSON.stringify(animeSongs, null, 2));
}

main();
