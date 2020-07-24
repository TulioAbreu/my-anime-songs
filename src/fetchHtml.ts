const nodeFetch: NodeRequire = require('node-fetch');

interface Page {
    status: string,
    htmlText: string,
}

async function getPageText(url: string): Promise<Page> {
    const pageHtml: Response = await nodeFetch(url);

    return {
        status: pageHtml.status.toString(),
        htmlText: await pageHtml.text(),
    }
}

export {
    getPageText,
    Page,
};