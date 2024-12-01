const newAction = (name, schemaName) =>
  `"use server"

import * as z from "zod";
import { ${schemaName} } from '@/schemas';

export const ${name} = async (values: z.infer<typeof ${schemaName}>) => {
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
`;

export default newAction;
