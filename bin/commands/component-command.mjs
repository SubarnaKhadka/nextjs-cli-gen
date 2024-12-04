import chalk from "chalk";

import inquirer from "inquirer";
import { capitalize } from "../utils/formatters.mjs";

import figlet from "figlet";
import ComponentCommand from "./command.mjs";

export function runCommandComponent(ctype, name, cPath) {
  console.log(
    chalk.blue(figlet.textSync(capitalize(ctype), { horizontalLayout: "full" }))
  );

  switch (ctype) {
    case "form": {
      inquirer
        .prompt([
          {
            type: "input",
            name: "fields",
            message: "What are the form fields?",
            choices: ["name", "email", "password"],
            default: "email,password",
          },
          {
            type: "input",
            name: "schemaName",
            message: "What's your schema name?",
            default: `${capitalize(name)}Schema`,
          },
          {
            type: "input",
            name: "schemaPath",
            message: "What's your schema path?",
            default: `./schemas/${name}.schema.ts`,
          },
          {
            type: "input",
            name: "actionName",
            message: "What's your action name?",
            default: `${name}Action`,
          },
          {
            type: "input",
            name: "actionPath",
            message: "What's your action path?",
            default: `./actions/${name}.action.ts`,
          },
        ])
        .then((answers) => {
          answers.cPath = cPath;
          answers.name = name;
          answers.ctype= ctype;
          ComponentCommand(answers);
        });
    }
  }
}
