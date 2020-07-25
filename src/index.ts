import Prompts from "prompts";
import Chalk from "chalk";
import { parseSongToKeyword } from "./keywords";
import { getUserAnimelist } from './myAnimeList';
import { getSongList } from "./songList";

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
