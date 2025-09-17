import { execSync } from "child_process";

export function installDeps(pkgManager, cwd) {
    execSync(`${pkgManager} install`, { cwd, stdio: "inherit" });
}
