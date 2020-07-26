const nodeFetch: NodeRequire = require('node-fetch');
import sleep from "./sleep";

const config = require("../config.json");
const MAX_REQUESTS = config["maxRequests"];
const TIME_INTERVAL_AFTER_TIMEOUT = config["timeIntervalAfterTimeout"];

interface Page {
    status: string,
    htmlText: string,
}

const HTTP_STATUS_OK = 200;

async function getPageText(url: string): Promise<Page | undefined> {
    let page: Response;
    let requests = 0;

    do {
        page = await nodeFetch(url);
        requests += 1;

        if (page.status !== HTTP_STATUS_OK) {
            await sleep(TIME_INTERVAL_AFTER_TIMEOUT);
        }
    } while (page.status !== HTTP_STATUS_OK && requests < MAX_REQUESTS);

    if (requests >= MAX_REQUESTS) {
        console.error("[ERROR] getPageText => Maximum request attempts.");
        return undefined;
    } else {
        return {
            status: page.status.toString(),
            htmlText: await page.text(),
        }
    }
}

export {
    getPageText,
    Page,
};