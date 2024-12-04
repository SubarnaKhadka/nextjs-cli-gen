import fs from "fs";
import path from "path";

import inquirer from "inquirer";
import { program } from "commander";

import { capitalize } from "./formatters.mjs";
import { beautyTerminal, terminalError } from "./beautyTerminal.mjs";
import {
  isAtTheRootOfANextJsProject,
  isUsingSrcDirectory,
} from "./checkers.mjs";
import newPageTemplate from "../templates/page.mjs";
import newDefaultComponentTemplate from "../templates/defined-components/default.mjs";
import { runCommandComponent } from "../commands/component-command.mjs";
import newAction from "../templates/action.mjs";
import { generateComponent } from "../commands/command.mjs";

export default function generate(element, name, currPath, schema, props) {
  if (isAtTheRootOfANextJsProject()) {
    let targetDir = isUsingSrcDirectory()
      ? path.join(process.cwd(), "src/app")
      : path.join(process.cwd(), "app");

    const normalized = path.normalize(currPath);

    switch (element) {
      case "page":
      case "p":
        (async () => {
          let pageName = name;

          if (!pageName) {
            const answers = await inquirer.prompt([
              {
                type: "input",
                name: "name",
                message: "What's your page name?:",
                required: true,
              },
            ]);

            pageName = answers.name;
          }

          const pageComponentName = capitalize(pageName);

          const normalizedPath = path.normalize(
            currPath.replace(/^\.\/app\//, "./")
          );

          targetDir = path.join(targetDir, normalizedPath, pageName);

          if (fs.existsSync(targetDir)) {
            terminalError(`page ${pageName} already exists`);
            return;
          }

          fs.mkdirSync(targetDir, {
            recursive: true,
          });

          fs.writeFileSync(
            path.join(targetDir, `page.tsx`),
            newPageTemplate(pageComponentName)
          );

          beautyTerminal("page");
        })();

        break;

      case "component":
      case "c":
        if (props) {
          const normalizedPath = path.normalize(
            currPath.replace(/^\.\/components\//, "./")
          );
          return generateComponent(name, normalizedPath, props);
        }
        inquirer
          .prompt([
            {
              type: "list",
              name: "cType",
              message: "Select the component you want:",
              choices: [
                { name: "Form", value: "form" },
                { name: "Default", value: "default" },
              ],
            },
            {
              type: "input",
              name: "name",
              message: "What's your component name?:",
              required: true,
              default: name ?? "",
            },
          ])
          .then((answers) => {
            const { cType, name } = answers;
            if (cType !== "default") {
              runCommandComponent(cType, name, normalized);
              return;
            }

            const componentName = capitalize(name);

            targetDir = isUsingSrcDirectory()
              ? path.join(process.cwd(), "src", "components", normalized)
              : path.join(process.cwd(), "components", normalized);

            if (!fs.existsSync(targetDir)) {
              fs.mkdirSync(targetDir, { recursive: true });
            }

            fs.writeFileSync(
              path.join(targetDir, `${name}.tsx`),
              newDefaultComponentTemplate(componentName)
            );
            return;
          });

        break;

      case "action":
      case "a":
        const actionFileName = name ?? "action";

        const actionName = name ? name + "Action" : "Action";

        const normalizedPath = path.normalize(
          currPath.replace(/^\.\/actions\//, "./")
        );

        targetDir = path.join(
          isUsingSrcDirectory()
            ? path.join(process.cwd(), "src")
            : process.cwd(),
          "actions",
          normalizedPath
        );

        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, {
            recursive: true,
          });
        }

        fs.writeFileSync(
          path.join(targetDir, `${actionFileName}.ts`),
          newAction(actionName, schema)
        );

        beautyTerminal("action");
        break;

      default:
        throw new Error();
    }
  } else {
    terminalError(
      `the path::> ${process.cwd()}\n does not correspond to a next project`
    );
  }
}
