import Prompts from "prompts";
import Chalk from "chalk";
import { parseSongToKeyword } from "./modules/keyword-parser";
import { getProfileUrl, getUserAnimeUrlsFromPage } from "./modules/mal-retriever";
import { getSongList } from "./modules/song-list-retriever";
import { getYoutubeSongs } from "./youtubeSearch";
import saveJSON from "./modules/utils/save-json";
import { getPageText } from "./modules/page-retriever";
import { Progress } from "./modules/progress";

async function main() {
    const { username } = await Prompts({
        type: "text",
        name: "username",
        message: "What is your MyAnimeList username?",
    });

    const userAnimeListUrl = getProfileUrl(username);
    const userAnimeListPage = (await getPageText(userAnimeListUrl))?.htmlText;
    if (!userAnimeListPage || !userAnimeListPage.length) {
        console.error(`❌ ${Chalk.red("ERROR")} User has empty list or does not exist.`);
        return;
    }

    const userAnimeList = getUserAnimeUrlsFromPage(userAnimeListPage);
    const animeSongsProgress = new Progress("Downloading anime list", userAnimeList.length);
    const animeSongs = await getSongList(username, userAnimeList, {
        onStart: () => { animeSongsProgress.start(); },
        onProgress: () => { animeSongsProgress.progress(); },
        onFinish: () => { animeSongsProgress.finish(); },
    });

    const youtubeKeywords = animeSongs.map(parseSongToKeyword);
    const playListSearchProgress = new Progress("Searching youtube URLs", youtubeKeywords.length);
    const playList = await getYoutubeSongs(youtubeKeywords, {
        onStart: () => { playListSearchProgress.start(); },
        onProgress: () => { playListSearchProgress.progress(); },
        onFinish: () => { playListSearchProgress.finish(); },
    });
    saveJSON(`./${username}_playlist.json`, playList);
}

main();
