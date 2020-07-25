const nodeFetch: NodeRequire = require('node-fetch');
import sleep from "./sleep";

interface Page {
    status: string,
    htmlText: string,
}

const MAX_REQUESTS = 10;
const HTTP_STATUS_OK = 200;
const SLEEP_TIME = 1000;

async function getPageText(url: string): Promise<Page | undefined> {
    let page: Response;
    let requests = 0;

    do {
        page = await nodeFetch(url);
        requests += 1;

        if (page.status !== HTTP_STATUS_OK) {
            await sleep(SLEEP_TIME);
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