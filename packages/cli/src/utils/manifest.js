import fs from "fs";
import path from "path";

export function readManifest(repoRoot) {
    const manifestPath = path.join(repoRoot, "templates.json");
    if (!fs.existsSync(manifestPath)) return {};
    try {
        return JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    } catch {
        return {};
    }
}
