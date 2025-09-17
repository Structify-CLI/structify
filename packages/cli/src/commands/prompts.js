import inquirer from "inquirer";
import chalk from "chalk";

export async function runPrompts() {
    return await inquirer.prompt([
        {
            type: "input",
            name: "projectName",
            message: chalk.cyanBright("📦 Enter your project name:"),
            default: "my-app",
            validate: (input) => (input ? true : "Project name cannot be empty"),
        },
        {
            type: "list",
            name: "framework",
            message: chalk.cyanBright("🚀 Choose your framework:"),
            choices: [
                { name: chalk.yellow("React"), value: "react" },
                { name: chalk.green("Next.js"), value: "next" },
            ],
        },
        {
            type: "list",
            name: "language",
            message: chalk.cyanBright("📜 Choose your language setup:"),
            choices: [
                { name: chalk.blue("JavaScript"), value: "js" },
                { name: chalk.blue("JavaScript + SWC ⚡"), value: "js-swc" },
                { name: chalk.magenta("TypeScript"), value: "ts" },
                { name: chalk.magenta("TypeScript + SWC ⚡"), value: "ts-swc" },
            ],
        },
        {
            type: "list",
            name: "structure",
            message: chalk.cyanBright("🏗️  Choose your project structure:"),
            choices: [
                { name: chalk.green("Feature-structure"), value: "feature" },
                { name: chalk.yellow("Component-based-structure"), value: "component" },
                { name: chalk.cyan("Clean Architecture"), value: "clean" },
                { name: chalk.magenta("Atomic Design"), value: "atomic" },
            ],
        },
    ]);
}
