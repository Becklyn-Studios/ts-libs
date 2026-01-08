#!/usr/bin/env node
import { program } from "commander";
import { add } from "../cli/add";
import { init } from "../cli/init";
import { getAvailableComponents } from "../cli/registry";

program
    .name("@becklyn/components")
    .description("CLI for @becklyn/components - Add components to your project")
    .version("1.0.0");

program
    .command("init")
    .description("Initialize your project and install dependencies")
    .action(init);

program
    .command("add")
    .description(
        `
Add a component to your project

Available components: 
  - ${getAvailableComponents().join("\n  - ")}

Example:
   npx @becklyn/components add Button`
    )
    .argument("<components...>", "The components to add")
    .option("-y, --yes", "Skip confirmation prompts")
    .option("--overwrite", "Overwrite existing files")
    .option("--components <path>", "Components directory", "components")
    .action(add);

program.parse();
