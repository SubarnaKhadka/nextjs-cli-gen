import fs from "fs";
import path from "path";

export function isAtTheRootOfANextJsProject() {
  const executedCommandDir = process.cwd();
  const nextConfigPath = path.join(executedCommandDir, "next.config");
  const nextEnvPath = path.join(executedCommandDir, "next-env.d");
  const existPath =
    fs.existsSync(`${nextConfigPath}.js`) ||
    fs.existsSync(`${nextConfigPath}.ts`) ||
    fs.existsSync(`${nextEnvPath}.ts`);

  if (existPath) {
    return true;
  }

  return false;
}

export function isUsingTypescript() {
  const executedCommandDir = process.cwd();
  const tsConfigJson = path.join(executedCommandDir, "tsconfig.json");

  const existPath = fs.existsSync(tsConfigJson);

  if (existPath) {
    return true;
  }

  return false;
}

export function isUsingSrcDirectory() {
  const executedCommandDir = process.cwd();
  const srcDirPath = path.join(executedCommandDir, "src");

  const existDir = fs.existsSync(srcDirPath);

  if (existDir) {
    return true;
  }

  return false;
}
