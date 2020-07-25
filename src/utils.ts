import * as fs from "fs";

export function saveJSON(path: string, data: any) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}
