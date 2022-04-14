import { window, workspace } from "vscode";
import { writeFile, readFile } from "fs/promises";
import { join } from "path";
import { snippet } from "./interface/snippet";

export async function python() {
  try {
    // Prompt user to enter the title
    const title = await showInputBox(
      "Custom Title",
      "Enter your title of the snippet"
    );
    // Prompt user to enter the prefix to be associated
    const prefix = await showInputBox("prefix", "Enter your custom prefix");
    // Prompt user to enter the file path where the code is linked to
    const filePath = await showInputBox(
      "/filename.py",
      "Enter the file path relative to the current workspace, should start with /",
      [1, 9]
    );
    if (filePath) {
      if (filePath.includes("/") && filePath[0] === "/") {
        // Prompt user to enter the description of the intellisense
        if (filePath.includes(".py")) {
          const description = await showInputBox(
            "description",
            "Description of the prefix"
          );
          // Read the file
          if (workspace.workspaceFolders !== undefined) {
            const workspacePath = workspace.workspaceFolders[0].uri.path;
            const file = await readFile(workspacePath + filePath);
            const contents = file.toString().split("\n");
            contents.forEach((line, i) => {
              if (line === "") {
                contents[i] = "$2";
              }
            });
            // Read json file
            const data = await readFile(join(__dirname, "../", "python.json"));
            const jsonContents = JSON.parse(data.toString());
            const newSnippet: snippet = {
              title: {
                prefix,
                body: contents,
                description,
              },
            };
            Object.assign(jsonContents, newSnippet);
            // Write into the respective json file after processing
            await writeFile(
              join(__dirname, "../", "python.json"),
              JSON.stringify(jsonContents)
            );
          } else {
            window.showErrorMessage("You need to have a workspace open");
          }
        } else {
          window.showErrorMessage(
            "File should be a python file, mention the .py"
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

export async function DeletePython() {
  try {
    // Read JSON File
    const data = await readFile(join(__dirname, "../", "python.json"));
    // Get which title
    let title: string | undefined = "";
    title = await showInputBox("title", "Enter your title");
    // Delete the snippet
    const json = JSON.parse(data.toString());
    if (title && json[title] === undefined) {
      throw Error(`${title} doesn't exist`);
    }
    if (title) {
      delete json[title];
    }
    // Write into file
    await writeFile(
      join(__dirname, "../", "python.json"),
      JSON.stringify(json)
    );
  } catch (error: any) {
    window.showErrorMessage(error.message);
  }
}
