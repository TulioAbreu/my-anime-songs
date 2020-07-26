import * as fs from "fs";

export default function saveJSON(path: string, data: any) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}
