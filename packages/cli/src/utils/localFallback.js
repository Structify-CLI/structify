import fs from "fs";

export function copyLocalTemplate(localPath, targetDir) {
    if (!fs.existsSync(localPath)) return false;
    fs.cpSync(localPath, targetDir, { recursive: true });
    return true;
}
