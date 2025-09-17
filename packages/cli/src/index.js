#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { runPrompts } from "./prompts.js";
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

program.name("structify").description("Structify CLI - Bootstrap your project with the perfect structure 🚀").version("0.1.0");

program
    .command("create-app")
    .description("Create a new project with Structify")
    .action(async () => {
        const manifest = readManifest();

        // 1️⃣ Run prompts
        const answers = await runPrompts();
        const projectName = answers.projectName;
        const framework = answers.framework; // react / next
        const language = answers.language; // js / js-swc / ts / ts-swc
        const structure = answers.structure; // feature / component / clean / atomic

        console.log(chalk.blue(`\n✨ Creating project: ${projectName}`));
        console.log(chalk.green(`→ Framework: ${framework}`));
        console.log(chalk.green(`→ Language: ${language}`));
        console.log(chalk.green(`→ Structure: ${structure}\n`));

        const targetDir = path.resolve(process.cwd(), projectName);

        // 2️⃣ Get template repo
        const templateKey = `${framework}-${language}-${structure}`; // يمكن تظبط حسب naming convention
        let templateRepo = manifest[templateKey] || manifest[framework]; // fallback to framework template

        if (!templateRepo) {
            console.error(chalk.red("❌ No template found for this combination."));
            process.exit(1);
        }

        console.log(chalk.blue(`⬇️  Fetching template from ${templateRepo}...`));
        const emitter = degit(templateRepo, { cache: false, force: true, verbose: false });
        try {
            await emitter.clone(targetDir);
            console.log(chalk.green("✅ Template downloaded (remote)"));
        } catch (err) {
            console.log(chalk.red("⚠️  Remote template failed — falling back to local template"));
        }

        // 3️⃣ Fallback local
        if (!fs.existsSync(targetDir) || fs.readdirSync(targetDir).length === 0) {
            const localFallback = path.join(repoRoot, "packages", "templates", framework, structure);
            if (fs.existsSync(localFallback)) {
                console.log(chalk.blue("📁 Copying local fallback template..."));
                fs.cpSync(localFallback, targetDir, { recursive: true });
                console.log(chalk.green("✅ Local template copied"));
            } else {
                console.error(chalk.red("❌ No template found (remote failed and no local fallback)."));
                process.exit(1);
            }
        }

        // 4️⃣ Initialize git
        console.log(chalk.blue("⚙️  Initializing git..."));
        execSync("git init", { cwd: targetDir, stdio: "inherit" });

        // 5️⃣ Install dependencies
        const pkgManager = detectPkgManager();
        console.log(chalk.blue(`📦 Installing dependencies with ${pkgManager}...`));
        execSync(`${pkgManager} install`, { cwd: targetDir, stdio: "inherit" });

        console.log(chalk.green("🎉 Project ready!"));
        console.log(`Next steps:\n  cd ${projectName}\n  ${pkgManager} run dev\n`);
    });

program.parse(process.argv);
