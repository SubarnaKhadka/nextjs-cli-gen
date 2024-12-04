import fs from "fs";
import path from "path";

export function getFolderStructure(dirPath) {
  const items = fs.readdirSync(dirPath, { withFileTypes: true });

  return items
    .filter((item) => !["node_modules", ".git"].includes(item.name))
    .map((item) => {
      const fullPath = path.join(dirPath, item.name);
      if (item.isDirectory()) {
        return {
          type: "folder",
          name: item.name,
          files: getFolderStructure(fullPath),
        };
      } else {
        return {
          type: "file",
          name: item.name,
        };
      }
    });
}
