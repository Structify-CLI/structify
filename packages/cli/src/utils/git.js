import { execSync } from "child_process";

export function initGit(cwd) {
    execSync("git init", { cwd, stdio: "inherit" });
}
