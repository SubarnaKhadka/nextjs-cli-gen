import fs from "fs";
import path from "path";
import chalk from "chalk";

import inquirer from "inquirer";
import { capitalize } from "../utils/formatters.mjs";
import Schemas from "../templates/defined-schemas/schema.mjs";
import newAction from "../templates/action.mjs";
import boxen from "boxen";
import formComponent from "../templates/defined-components/form.mjs";
import figlet from "figlet";

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
          const schemaTargetFile = path.join(process.cwd(), answers.schemaPath);

          const actionTargetFile = path.join(process.cwd(), answers.actionPath);

          const formComponentTarget = path.join(
            process.cwd(),
            "components",
            cPath,
            `${name}.tsx`
          );

          const fields = answers.fields.split(",");

          if (!fs.existsSync(schemaTargetFile)) {
            fs.mkdirSync(path.dirname(schemaTargetFile), { recursive: true });
          }

          if (!fs.existsSync(actionTargetFile)) {
            fs.mkdirSync(path.dirname(actionTargetFile), { recursive: true });
          }

          if (!fs.existsSync(formComponentTarget)) {
            fs.mkdirSync(path.dirname(formComponentTarget), {
              recursive: true,
            });
          }
          try {
            if (!fs.existsSync(schemaTargetFile)) {
              console.log(
                chalk.green(
                  `\n✅ ${answers.schemaName} has been created successfully.`
                )
              );

              fs.writeFileSync(
                schemaTargetFile,
                Schemas(answers.schemaName, fields, schemaTargetFile)
              );
            }
          } catch (err) {
            console.error(
              chalk.red(
                `❌ Cannot create schema: ${answers.schemaName}. ${answers.schemaName} has been reverted`
              )
            );
          }

          try {
            if (!fs.existsSync(actionTargetFile)) {
              fs.writeFileSync(
                actionTargetFile,
                newAction(answers.actionName, answers.schemaName)
              );
              console.log(
                chalk.green(
                  `\n✅ ${answers.actionName} has been created successfully.`
                )
              );
            }
          } catch (err) {
            console.error(
              chalk.red(`❌ Cannot create server action: ${answers.actionName}`)
            );
          }

          try {
            if (!fs.existsSync(formComponentTarget)) {
              fs.writeFileSync(
                formComponentTarget,
                formComponent(
                  capitalize(name),
                  answers.schemaName,
                  answers.actionName,
                  answers.actionPath,
                  fields
                )
              );
              console.log(
                chalk.green(
                  `\n✅ ${capitalize(name)} has been created successfully.`
                )
              );
            }
          } catch (err) {
            console.error(
              chalk.red(`❌ Cannot create form component: ${capitalize(name)}`)
            );
          }

          const summaryMessage = chalk.bold(
            "All tasks completed successfully!"
          );
          console.log(
            boxen(summaryMessage, {
              padding: 1,
              margin: 1,
              borderStyle: "round",
              borderColor: "green",
            })
          );
        });
    }
  }
}
