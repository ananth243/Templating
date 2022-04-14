import { window, workspace } from "vscode";
import { writeFile, readFile } from "fs/promises";
import { join } from "path";
import { snippet } from "./interface/snippet";

export async function javascript() {
  try {
    const title = await showInputBox(
      "Custom Title",
      "Enter your title of the snippet"
    );
    const prefix = await showInputBox("prefix", "Enter your custom prefix");
    const filePath = await showInputBox(
      "/filename.js",
      "Enter the file path relative to the current workspace, should start with /",
      [1, 9]
    );
    if (filePath) {
      if (filePath.includes("/") && filePath[0] === "/") {
        if (filePath.includes(".js")) {
          const description = await showInputBox(
            "description",
            "Description of the prefix"
          );
          if (workspace.workspaceFolders !== undefined) {
            const workspacePath = workspace.workspaceFolders[0].uri.path;
            const file = await readFile(workspacePath + filePath);
            const contents = file.toString().split("\n");
            contents.forEach((line, i) => {
              if (line === "") {
                contents[i] = "$2";
              }
            });
            const data = await readFile(
              join(__dirname, "../", "javascript.json")
            );
            const jsonContents = JSON.parse(data.toString());
            const newSnippet: snippet = {
              title: {
                prefix,
                body: contents,
                description,
              },
            };
            Object.assign(jsonContents, newSnippet);
            await writeFile(
              join(__dirname, "../", "javascript.json"),
              JSON.stringify(jsonContents)
            );
          } else {
            window.showErrorMessage("You need to have a workspace open");
          }
        } else {
          window.showErrorMessage(
            "File should be a javascript file, mention the .js"
          );
        }
      } else {
        window.showErrorMessage(`Your file path should start with a /`);
      }
    }
  } catch (error: any) {
    window.showErrorMessage(error.message);
  }
}

export async function showInputBox(
  value: string,
  placeHolder: string,
  valueSelection?: [number, number]
) {
  if (typeof valueSelection !== "undefined") {
    const result = await window.showInputBox({
      value,
      valueSelection,
      placeHolder,
    });
    return result;
  }
  const result = await window.showInputBox({
    value,
    placeHolder,
  });
  return result;
}

export async function DeleteJavascript() {
  try {
    // Read JSON File
    const data = await readFile(join(__dirname, "../", "javascript.json"));
    // Get which title
    const title = await showInputBox("title", "Enter your title");
    // Delete the snippet
    const json = JSON.parse(data.toString());
    if (title && json[title] === undefined) {
      throw Error("Title doesn't exist");
    }
    if (title) {
      delete json[title];
    }
    // Write into file
    await writeFile(
      join(__dirname, "../", "javascript.json"),
      JSON.stringify(json)
    );
  } catch (error: any) {
    window.showErrorMessage(error.message);
  }
}
