# nextjs-cli-gen - Next Command Line Interface

## Overview
nextjs-cli-gen CLI is a command-line interface tool that allows you to generate files based on predefined schematics. You can specify the type of schematic, the directory path, and the names of the generated files. This tool is designed to automate repetitive tasks and ensure consistency in file creation across your projects.

## Features
- **Generate files based on schematics**: Choose between different schematic types like `component`, `page`, `action` etc.
- **Customizable paths and names**: Specify the directory and filenames for your generated files.
- **Schema support**: Provide schemas like `EmailSchema`, `NameSchema`, `PasswordSchema` to structure your files accordingly.

## Installation

### Prerequisites
Make sure you have **Node.js** and **npm** installed on your system.

### Install the CLI Tool
```bash
npm install --g nextjs-cli-gen
```

or

```bash
npm install -save-dev nextjs-cli-gen
```

## Workspace and project files

the **gen** only works inside a *next*js folder or a next js workspace. So this means that the commands in command-overview nust be executed inside the next js project directory.

Use the **gen** command to add new files for  components, actions,and new pages.

## CLI command-language syntax

Command syntax is shown as follows:

```bash
gen <schematic> [path] [--name] [--schema]

```

## Command Overview

| Schematic    | ALIAS | DESCRIPTION                                           |
| ---------- | ----- | ----------------------------------------------------- |
| `page` | `p`   | Generates and/or modifies page files. |
| `action` | `a`   | Generates and/or modifies action files. |
| `component` | `c`   | Generates and/or modifies component files. |

# Command Test Scenarios

## Action ( `gen action` )

| Command | Result |
| ------- | ------ |
| `gen action` | Generates an `action.ts` file with action name     **Action**. |
| `gen action --name=login` | Generates `login.ts` with action name **loginAction**. |
| `gen action ./auth` | Generates `action.ts` inside the **auth** directory with action name **Action**. |
| `gen action ./auth --name="login"` | Generates `login.ts` inside the **auth** directory with action name **loginAction**. |

### Default Schema
By default, the schema is **Schema**. To import or read values from a different schema, you can add the following flag:

`--schema=LoginSchema`

#### Demo code generated 

```js
"use server"

import * as z from "zod";
import { LoginSchema } from '@/schemas';

export const loginAction = async (values: z.infer<typeof LoginSchema>) => {
  try {
    // INVOKE SERVICE HERE

    return { status: 200, message: "ok" };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 400, message: err?.message };
    }
    return { status: 400, message: "Unknown error" };
  }
};  

```

## Page ( `gen page` )