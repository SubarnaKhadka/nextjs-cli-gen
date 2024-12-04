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
npm install -g nextjs-cli-gen
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

| Command | Result |
| ------- | ------ |
| `gen page` | Prompts: "What's your page name?" After providing a name, it generates a directory with a `.tsx` file, e.g., **login** directory with `page.tsx` and component name **Login**. |
| `gen page --name=login` | it generates a directory with a `.tsx` file. **login** directory with `page.tsx` and component name **Login**. |
| `gen page ./auth --name=login` | Generates an `auth` folder. Within it, a **login** directory is created containing a `page.tsx` file, with the component name set to **Login**. |

### Example Flow
- When the --name flag is not given, user is prompted with "What's your page name?", and the name provided is `login`, the result is:
  - A `login` directory created.
  - Inside it, a `page.tsx` file is generated.
  - The component name inside the `page.tsx` file is set to `Login`.


#### Demo code generated 
```js
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: '',
}

export default function Login(){
    return (
     <div>Login page</div>
    )
}

```

## Component ( `gen component` )
| Command | Result |
| ------- | ------ |
| `gen component` | Prompts: "Select the component you want?". |
| `gen component --name=login` |  Prompts: "Select the component you want?" with default name login. |
| `gen component ./auth --name=login` |   Prompts: "Select the component you want?" with default name login and created inside **auth** directory. |

### Example Flow
The user is prompted with **Select the component you want**, and the result is: `eg`: For `Form`, the Form component is generated along with the form fields validation `schema` and the `action`.

- ![Screenshots 1](/screenshots/screenshot-1.PNG)

You can create customized components  with defined schematics.

- ![Screenshots 2](/screenshots/screenshot-2.PNG)

- ![Screenshots 3](/screenshots/screenshot-3.PNG)

- ![Screenshots 4](/screenshots/screenshot-4.PNG)

 #### Demo code generated 

```js
import * as z from "zod";

import { EmailSchema, PasswordSchema } from "@/schemas/common";

export const LoginFormSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

```
```js
import * as z from 'zod';

export const EmailSchema = z
    .string({
        invalid_type_error: "Invalid email field",
        required_error: "email is required",
    })
    .email("Please provide a valid email")
    .min(1, "Email is too short");

export const PasswordSchema = z
    .string({
        invalid_type_error: "Invalid password field",
        required_error: "password is required",
    })
    .min(6, "Password must be at least 6 characters");

```

```js
"use client"

import React, { useCallback } from "react";

import * as z from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
 import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


import { cn } from "@/lib/utils";
import { useMutation } from "@/hooks";
import { LoginFormSchema } from "@/schemas";
import { LoginFormAction } from "./actions/LoginForm.action.ts";
import FormError from "@/components/form/form-error";
import { zodResolver } from "@hookform/resolvers/zod";
    
interface LoginFormProps {}

const LoginForm = (props: Readonly<LoginFormProps>): JSX.Element => {
     const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

   const [mutate, { error, isLoading }] = useMutation(LoginFormAction, {
    onError: (err) => {
      toast.error(err);
    },
    onSuccess: () => {
      toast.success("Login successfully");
      form.reset();
    },
  });

    const submit = useCallback(
    (values: z.infer<typeof LoginFormSchema>) => {
      mutate(values);
    },
    [mutate]
  );

  return (
     <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
          <div className="space-y-4">    
          <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                          {...field}
                          placeholder="Please Enter email"
                          type="email"
                        />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
					<FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                          {...field}
                          placeholder="Please Enter password"
                          type="password"
                        />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          <FormError message={error} />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
          </div>
        </form>
      </Form>
  )
    }

export default LoginForm;

```
`The component available are: [Form, Default]`

`The GUI web application also available: http://localhost:8080`
`npx studio`