const resolveFields = {
  name: {
    id: "name",
    label: "Name",
    placeholder: "Please Enter name",
    type: "text",
    componentType: "input",
  },
  email: {
    id: "email",
    label: "Email",
    placeholder: "Please Enter email",
    type: "email",
    componentType: "input",
  },
  password: {
    id: "password",
    label: "Password",
    placeholder: "Please Enter password",
    type: "password",
    componentType: "input",
  },
  confirmPassword: {
    id: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Please Enter confirm password",
    type: "password",
    componentType: "input",
  },
};

const formComponent = (name, schemaName, action, actionPath, fields) => {
  const formFields = fields.map(
    (field) =>
      resolveFields[field] || {
        id: field,
        label: field,
        placeholder: "Enter the vakue",
        type: "text",
        componentType: "input",
      }
  );

  return `"use client"

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
import { ${schemaName} } from "@/schemas";
import { ${action} } from "${actionPath}";
import FormError from "@/components/form/form-error";
import { zodResolver } from "@hookform/resolvers/zod";
    
interface ${name}Props {}

const ${name} = (props: Readonly<${name}Props>): JSX.Element => {
     const form = useForm<z.infer<typeof ${schemaName}>>({
    resolver: zodResolver(${schemaName}),
    defaultValues: {
      email: "",
      password: "",
    },
  });

   const [mutate, { error, isLoading }] = useMutation(${action}, {
    onError: (err) => {
      toast.error(err);
    },
    onSuccess: () => {
      toast.success("Login successfully");
      form.reset();
    },
  });

    const submit = useCallback(
    (values: z.infer<typeof ${schemaName}>) => {
      mutate(values);
    },
    [mutate]
  );

  return (
     <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
          <div className="space-y-4">    
          ${formFields
            .map(
              (item) =>
                `<FormField
              control={form.control}
              name='${item.id}'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>${item.label}</FormLabel>
                  <FormControl>
                    ${
                      item.componentType === "input" &&
                      `<Input
                          {...field}
                          placeholder="${item.placeholder}"
                          type="${item.type}"
                        />`
                    }
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />`
            )
            .join("\n\t\t\t\t\t")}

          <FormError message={error} />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
          </div>
        </form>
      </Form>
  )
    }

export default ${name};
`;
};

export default formComponent;
