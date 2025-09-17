import { Command } from "commander";
import { blue, green, yellow, red } from "kolorist";
import inquirer from "inquirer";
import degit from "degit";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const program = new Command();

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const repoRoot = path.resolve(__dirname, "../../..");
const manifestPath = path.join(repoRoot, "templates.json");

function readManifest() {
    if (!fs.existsSync(manifestPath)) return {};
    try {
        return JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    } catch {
        return {};
    }
}

function detectPkgManager() {
    if (fs.existsSync(path.join(process.cwd(), "pnpm-lock.yaml"))) return "pnpm";
    if (fs.existsSync(path.join(process.cwd(), "yarn.lock"))) return "yarn";
    if (fs.existsSync(path.join(process.cwd(), "package-lock.json"))) return "npm";
    return "npm"; // default
}

program.name("structify").description("Structify - scaffold modern web projects (React/Next)").version("0.2.0");

program
    .command("init [project-name]")
    .description("Initialize a new project")
    .option("-t, --template <template>", "Choose template (react, next, ...)")
    .action(async (name, options) => {
        const manifest = readManifest();
        let projectName = name;

        // Ask for project name if not provided
        if (!projectName) {
            const { pname } = await inquirer.prompt([{ type: "input", name: "pname", message: "Project name:", default: "my-app" }]);
            projectName = pname;
        }

        // Ask for template if not provided
        let template = options.template;
        if (!template) {
            const { tmpl } = await inquirer.prompt([
                {
                    type: "list",
                    name: "tmpl",
                    message: "Select a framework:",
                    choices: Object.keys(manifest),
                },
            ]);
            template = tmpl;
        }

        console.log(blue(`✨ Creating project: ${projectName}`));
        console.log(green(`→ Template: ${template}`));

        const targetDir = path.resolve(process.cwd(), projectName);

        // Try remote template first
        const templateRepo = manifest[template];
        if (templateRepo) {
            console.log(blue(`⬇️  Fetching template from ${templateRepo}...`));
            const emitter = degit(templateRepo, { cache: false, force: true, verbose: false });
            try {
                await emitter.clone(targetDir);
                console.log(green("✅ Template downloaded (remote)"));
            } catch (err) {
                console.log(red("⚠️  Remote template failed — falling back to local template"));
            }
        }

        // Fallback local
        if (!fs.existsSync(targetDir) || fs.readdirSync(targetDir).length === 0) {
            const localFallback = path.join(repoRoot, "packages", "templates", template, "base");
            if (fs.existsSync(localFallback)) {
                console.log(blue("📁 Copying local fallback template..."));
                fs.cpSync(localFallback, targetDir, { recursive: true });
                console.log(green("✅ Local template copied"));
            } else {
                console.error(red("❌ No template found (remote failed and no local fallback)."));
                process.exit(1);
            }
        }

        // Init git
        console.log(blue("⚙️  Initializing git..."));
        execSync("git init", { cwd: targetDir, stdio: "inherit" });

        // Detect package manager
        const pkgManager = detectPkgManager();
        console.log(blue(`📦 Installing dependencies with ${pkgManager}...`));
        execSync(`${pkgManager} install`, { cwd: targetDir, stdio: "inherit" });

        console.log(green("🎉 Project ready!"));
        console.log(`Next steps:\n  cd ${projectName}\n  ${pkgManager} run dev\n`);
    });

program.parse(process.argv);
