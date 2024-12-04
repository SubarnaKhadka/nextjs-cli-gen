#!/usr/bin/env node

import path from "path";
import express from "express";

import generate from "../bin/utils/generate.mjs";
import { getFolderStructure } from "./server/utils.mjs";

const app = express();

app.use(express.static(path.join(process.cwd(), "GUI", "public")));

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
  console.log(`app listening on port 8080`);
});
