import { Novel } from "./typings";
import * as vscode from "vscode";

const fs = require("fs");
const path = require("path");
let { localNovelsPath } = vscode.workspace.getConfiguration("workbench");
localNovelsPath =
  localNovelsPath ||
  "C:\\Users\\kitety\\Documents\\my\\kitety-vsc-extension-demo\\src\\books";
export function getLocalBooks(): Promise<Novel[]> {
  const files = fs.readdirSync(localNovelsPath);
  const localNovelList = [] as Novel[];
  files.forEach((file: string) => {
    const extname = path.extname(file).substr(1);
    if (extname === "txt") {
      const name = path.basename(file, ".txt");
      console.log("name: ", name);
      const txtPath = path.join(localNovelsPath, file);
      console.log("txtPath: ", txtPath);
      localNovelList.push({
        path: path.resolve(txtPath).replace(/\\/g, "\\"),
        name,
      });
    }
  });
  return Promise.resolve(localNovelList);
}
