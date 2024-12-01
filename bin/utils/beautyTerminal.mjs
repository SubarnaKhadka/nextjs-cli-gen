import boxen from "boxen";
import chalk from "chalk";

import { capitalize } from "./formatters.mjs";

export const beautyTerminal = (schematic) => {
  const text =
    schematic === "component"
      ? chalk.white.bgBlue(schematic) + " created successfully."
      : schematic === "schema"
      ? chalk.white.bgMagenta(schematic) + " created successfully."
      : schematic === "action"
      ? chalk.black.yellow(capitalize(schematic)) + " created successfully."
      : chalk.green("✔️  " + capitalize(schematic) + " created successfully.");

  console.log(text);
};

export const terminalError = (sms) => {
  console.log(
    boxen(chalk.red(sms), {
      borderStyle: "arrow",
      title: "Something went wrong",
      textAlignment: "center",
      titleAlignment: "center",
      padding: 1,
      margin: 4,
    })
  );
};
