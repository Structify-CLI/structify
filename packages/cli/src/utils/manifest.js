import fs from "fs";
import path from "path";

export function readManifest(repoRoot) {
    const manifestPath = path.join(repoRoot, "templates.json");

    try {
        const content = fs.readFileSync(manifestPath, "utf-8");
        const parsed = JSON.parse(content);
        return parsed;
    } catch (error) {
        console.log(`❌ Error parsing manifest: ${error.message}`);
        return {};
    }
}
