import { window } from "vscode";

export async function css() {
  const title = await showInputBox(
    "Custom Title",
    "Enter your title of the snippet"
  );
  const prefix = await showInputBox("prefix", "Enter your custom prefix");
  const filePath = await showInputBox(
    "/filename",
    "Enter the file path, should startwith /"
  );
  if (filePath) {
    if (filePath.includes("/")) {
      const description = await showInputBox(
        "description",
        "Description of the prefix"
      );
    } else {
      window.showInformationMessage(`Please specify the /`);
    }
  }
}

export async function showInputBox(value: string, placeHolder: string) {
  const result = await window.showInputBox({
    value,
    placeHolder,
  });
  return result;
}
