import { window } from "vscode";

export async function python() {
  // Prompt user to enter the title
  const title = await showInputBox(
    "Custom Title",
    "Enter your title of the snippet"
  );
  // Prompt user to enter the prefix to be associated
  const prefix = await showInputBox("prefix", "Enter your custom prefix");
  // Prompt user to enter the file path where the code is linked to
  const filePath = await showInputBox(
    "/filename",
    "Enter the file path, should startwith /"
  );
  if (filePath) {
    if (filePath.includes("/")) {
      // Prompt user to enter the description of the intellisense
      const description = await showInputBox(
        "description",
        "Description of the prefix"
      );
      // Read the file
      // Write into the respective json file after processing
      // Close the file
    } else {
      window.showErrorMessage(`Please specify the /`);
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
