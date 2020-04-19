const nodeFetch: NodeRequire = require('node-fetch');
async function getPageText(url: string): Promise<string> {
    const pageHtml: Response = await nodeFetch(url);

    return pageHtml.text();
}

export {
    getPageText
};