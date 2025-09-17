import fs from "fs";
import path from "path";

export function detectPkgManager(cwd = process.cwd()) {
    if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
    if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
    if (fs.existsSync(path.join(cwd, "package-lock.json"))) return "npm";
    return "npm"; // default
}
