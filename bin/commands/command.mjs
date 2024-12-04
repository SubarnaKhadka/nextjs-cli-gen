import fs from "fs";
import path from "path";

import boxen from "boxen";
import Schemas from "../templates/defined-schemas/schema.mjs";
import newAction from "../templates/action.mjs";
import formComponent from "../templates/defined-components/form.mjs";
import chalk from "chalk";
import { capitalize } from "../utils/formatters.mjs";

export default function ComponentFormCommand(answers) {
  const schemaTargetFile = path.join(process.cwd(), answers.schemaPath);

  const actionTargetFile = path.join(process.cwd(), answers.actionPath);

  const formComponentTarget = path.join(
    process.cwd(),
    "components",
    answers.cPath,
    `${answers.name}.tsx`
  );

  const fields = answers.fields ? answers.fields.split(",") : ["email"];

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
        chalk.green(`\n✅ ${answers.schemaName} has been created successfully.`)
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
        chalk.green(`\n✅ ${answers.actionName} has been created successfully.`)
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
          capitalize(answers.name),
          answers.schemaName,
          answers.actionName,
          answers.actionPath,
          fields
        )
      );
      console.log(
        chalk.green(
          `\n✅ ${capitalize(answers.name)} has been created successfully.`
        )
      );
    }
  } catch (err) {
    console.error(
      chalk.red(`❌ Cannot create form component: ${capitalize(answers.name)}`)
    );
  }

  const summaryMessage = chalk.bold("All tasks completed successfully!");
  console.log(
    boxen(summaryMessage, {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "green",
    })
  );
}

export function generateComponent(name, normalized, props) {
  console.log(props);
  if (props.ctype === "default") {
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
  } else if (props.ctype === "form") {
    let answers = props;

    console.log(answers, "....answers");

    answers.name = name;
    answers.cPath = normalized;

    return ComponentFormCommand(answers);
  }
}
