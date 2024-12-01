#!/usr/bin/env node

import y from "yargs";
import { hideBin } from "yargs/helpers";

import generate from "./utils/generate.mjs";

const yargs = y(hideBin(process.argv));

yargs
  .scriptName("gen")
  .usage("\nUsage: $0 <schematic> [path] [--name] [--schema]")
  .command({
    command: "$0 <schematic> [path] [--name] [--schema]",
    desc: "Generates and files based on a schematic.",
    builder: (yargs) => {
      return yargs
        .positional("schematic", {
          type: "string",
          describe: "The schematic to use (e.g., 'page', 'component')",
          demandOption: true,
        })
        .positional("path", {
          type: "string",
          default: ".",
          describe: "The directory path where the files should be generated",
        })
        .option("name", {
          alias: "n",
          type: "string",
          description: "The name of the file or component to generate",
          demandOption: false,
        })
        .option("schema", {
          alias: "s",
          type: "string",
          description: "The schema to use (e.g., 'LoginSchema')",
          default: "Schema",
        });
    },
    handler: (argv) => {
      try {
        const { path, schematic, name, schema } = argv;

        if (schematic && path) {
          generate(schematic, name, path, schema);
        } else {
          options.showHelp();
        }
      } catch {
        yargs.showHelp();
      }
    },
  })
  .help().argv;

process.on("beforeExit", () => {
  process.exit(0);
});
