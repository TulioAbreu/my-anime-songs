import * as fs from "fs";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export default function saveJSON(path: string, data: any): void {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}
