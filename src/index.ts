import Prompts from "prompts";
import Chalk from "chalk";
import { parseSongToKeyword } from "./modules/keyword-parser";
import { getProfileUrl, getUserAnimeUrlsFromPage } from "./modules/mal-retriever";
import { getSongList } from "./modules/song-list-retriever";
import { getYoutubeSongs } from "./youtubeSearch";
import saveJSON from "./modules/utils/save-json";
import { getPageText } from "./modules/page-retriever";

async function main() {
    const { username } = await Prompts({
        type: "text",
        name: "username",
        message: "What is your MyAnimeList username?",
    });

    const userAnimeListUrl = getProfileUrl(username);
    const userAnimeListPage = (await getPageText(userAnimeListUrl))?.htmlText;
    if (!userAnimeListPage) {
        console.error(`❌ ${Chalk.red("ERROR")} User has empty list or does not exist.`);
        return;
    }

    const userAnimeList = getUserAnimeUrlsFromPage(userAnimeListPage);
    const animeSongs = await getSongList(username, userAnimeList);

    const youtubeKeywords = animeSongs.map((animeSong: string) => {
        return parseSongToKeyword(animeSong);
    });

    const playList = await getYoutubeSongs(youtubeKeywords);
    saveJSON(`./${username}_playlist.json`, playList);
}

main();
