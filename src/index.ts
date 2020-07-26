import Prompts from "prompts";
import Chalk from "chalk";
import { parseSongToKeyword } from "./controllers/keyword-parser";
import { getUserAnimelist } from './myAnimeList';
import { getSongList } from "./songList";
import { getYoutubeSongs } from "./youtubeSearch";
import { saveJSON } from "./utils";

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

    const playList = await getYoutubeSongs(youtubeKeywords);
    saveJSON(`./${username}_playlist.json`, playList);
}

main();
