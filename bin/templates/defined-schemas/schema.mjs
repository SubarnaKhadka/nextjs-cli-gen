import path from "path";
import fs from "fs";
import chalk from "chalk";

const resolveValidations = (field) => {
  switch (field) {
    case "email":
      return "EmailSchema";
    case "password":
      return "PasswordSchema";
    default:
      return;
  }
};

const formValidation = {
  name: `export const NameSchema = z
    .string()
    .min(1, { message: "Name is required" }) // Ensures required validation
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name must not exceed 50 characters." });\n\n`,

  email: `export const EmailSchema = z
    .string({
        invalid_type_error: "Invalid email field",
        required_error: "email is required",
    })
    .email("Please provide a valid email")
    .min(1, "Email is too short");\n\n`,
  password: `export const PasswordSchema = z
    .string({
        invalid_type_error: "Invalid password field",
        required_error: "password is required",
    })
    .min(6, "Password must be at least 6 characters");\n`,
};

const Schemas = (name, fields, schemaPath) => {
  const IndexFilePath = path.join(process.cwd(), "schemas", "index.ts");

  const CommonValidationPath = path.join(
    process.cwd(),
    "schemas",
    "common",
    "index.ts"
  );

  if (!fs.existsSync(IndexFilePath)) {
    fs.mkdirSync(path.dirname(IndexFilePath), { recursive: true });
    fs.writeFileSync(IndexFilePath, ``);
  }

  if (!fs.existsSync(CommonValidationPath)) {
    fs.mkdirSync(path.dirname(CommonValidationPath), { recursive: true });
    fs.writeFileSync(CommonValidationPath, `import * as z from 'zod';\n\n`);
  }

  const fileContent = fs.readFileSync(CommonValidationPath, "utf-8");

  const store = {};

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];

    let validation = resolveValidations(field);

    store[field] = validation;

    const schemaPattern = new RegExp(
      `export\\s+const\\s+${validation}\\s*=`,
      "m"
    );

    if (schemaPattern.test(fileContent)) continue;

    const newContent = formValidation[field];

    if (newContent) {
      fs.appendFileSync(CommonValidationPath, newContent, "utf-8");
      console.log(`✅ ${validation} has been added to the file.`);
    } else {
      console.error(`❌ No validation found for field: ${field}`);
    }
  }

  const relativePath = path.relative(
    path.join(process.cwd(), "schemas"),
    schemaPath
  );

  const exportedPath = relativePath
    .replace(/\\/g, "/")
    .replace(/\.[^/.]+$/, "");

  fs.appendFileSync(
    IndexFilePath,
    `export * from "./${exportedPath}";\n`,
    "utf-8"
  );

  console.log(`✅  @schemas/index.ts updated successfully. `);

  const schemaFields = Object.keys(store)
    .map((key) => ` ${key}: ${store[key] || "z.string()"}`)
    .join(",\n");

  return `
    import * as z from 'zod';

    import { ${Object.values(store)
      .filter(Boolean)
      .join(", ")} } from '@/schemas/common';

    export const ${name} = z.object({
    ${schemaFields}
    })
  `;
};

export default Schemas;
