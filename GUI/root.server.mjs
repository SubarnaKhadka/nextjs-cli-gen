#!/usr/bin/env node

import path from "path";
import express from "express";
import open from "open";
import { fileURLToPath } from "url";

import generate from "../bin/utils/generate.mjs";
import { getFolderStructure } from "./server/utils.mjs";

const app = express();

export const __filename = fileURLToPath(import.meta.url);

app.use(express.static(path.join(path.dirname(__filename), "public")));

app.use(express.json());

app.get("/tree", (req, res) => {
  const tree = getFolderStructure(path.join(process.cwd()));
  res.json(tree);
});

app.post("/exec-cmd", (req, res) => {
  const { schematic, path, name, schema, props } = req.body;

  generate(schematic, name, path, schema, props);
  res.status(200).send("ok");
});

app.listen(8080, () => {
  console.log(`Studio running on port 8080`);
  open(`http://localhost:8080`, { app: { name: "google chrome" } });
});
