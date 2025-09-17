#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import path from "path";
import { runPrompts } from "./prompts.js";
import { readManifest } from "../utils/manifest.js";
import { detectPkgManager } from "../utils/pkgManager.js";
import { fetchTemplate } from "../utils/template.js";
import { copyLocalTemplate } from "../utils/localFallback.js";
import { initGit } from "../utils/git.js";
import { installDeps } from "../utils/install.js";
import fs from "fs";

const program = new Command();

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const repoRoot = path.resolve(__dirname, "../../..");

program.name("structify").description("Structify CLI - Bootstrap your project with the perfect structure 🚀").version("0.1.0");

program
    .command("create-app")
    .description("Create a new project with Structify")
    .action(async () => {
        const manifest = readManifest(repoRoot);

        // 1️⃣ Run prompts
        const answers = await runPrompts();
        const projectName = answers.projectName;
        const framework = answers.framework;
        const language = answers.language;
        const structure = answers.structure;

        console.log(chalk.blue(`\n✨ Creating project: ${projectName}`));
        console.log(chalk.green(`→ Framework: ${framework}`));
        console.log(chalk.green(`→ Language: ${language}`));
        console.log(chalk.green(`→ Structure: ${structure}\n`));

        const targetDir = path.resolve(process.cwd(), projectName);

        // 2️⃣ Fetch template from remote
        const templateKey = `${framework}-${language}-${structure}`;
        const templateRepo = manifest[templateKey] || manifest[framework];

        if (!templateRepo) {
            console.error(chalk.red("❌ No template found for this combination."));
            process.exit(1);
        }

        console.log(chalk.blue(`⬇️  Fetching template from ${templateRepo}...`));
        const remoteSuccess = await fetchTemplate(templateRepo, targetDir);

        // 3️⃣ Fallback local template
        if (!remoteSuccess || !fs.existsSync(targetDir) || fs.readdirSync(targetDir).length === 0) {
            const localFallback = path.join(repoRoot, "packages", "templates", framework, structure);
            const localSuccess = copyLocalTemplate(localFallback, targetDir);
            if (!localSuccess) {
                console.error(chalk.red("❌ No template found (remote failed and no local fallback)."));
                process.exit(1);
            } else {
                console.log(chalk.green("✅ Local template copied"));
            }
        } else {
            console.log(chalk.green("✅ Template downloaded (remote)"));
        }

        // 4️⃣ Initialize git
        console.log(chalk.blue("⚙️  Initializing git..."));
        initGit(targetDir);

        // 5️⃣ Install dependencies
        const pkgManager = detectPkgManager(targetDir);
        console.log(chalk.blue(`📦 Installing dependencies with ${pkgManager}...`));
        installDeps(pkgManager, targetDir);

        console.log(chalk.green("🎉 Project ready!"));
        console.log(`Next steps:\n  cd ${projectName}\n  ${pkgManager} run dev\n`);
    });

program.parse(process.argv);
