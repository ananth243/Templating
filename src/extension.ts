import { ExtensionContext, commands, window } from "vscode";
import { python as Python, DeletePython } from "./python";
import { javascript as Javascript, DeleteJavascript } from "./javascript";
import { css as CSS, DeleteCSS } from "./css";
import { typescript as Typescript, DeleteTypescript } from "./typescript";

export function activate(context: ExtensionContext) {
  let disposable = commands.registerCommand("templating.createSnippet", () => {
    // Prompt user to enter which language they want to create a snippet for
    const options: {
      [key: string]: (context: ExtensionContext) => Promise<void>;
    } = {
      Typescript,
      Javascript,
      Python,
      CSS,
    };
    const quickPick = window.createQuickPick();
    quickPick.items = Object.keys(options).map((label) => ({ label }));
    quickPick.onDidChangeSelection((selection) => {
      if (selection[0]) {
        options[selection[0].label](context).catch(console.error);
      }
    });
    quickPick.onDidHide(() => quickPick.dispose());
    quickPick.show();
    window.showInformationMessage(
      "You will need to reload your window for the changes to show"
    );
  });
  let deleted = commands.registerCommand("templating.deleteSnippet", () => {
    const Typescript  = DeleteTypescript;
    const CSS  = DeleteCSS;
    const Javascript  = DeleteJavascript;
    const Python  = DeletePython;
    const options: {
      [key: string]: (context: ExtensionContext) => Promise<void>;
    } = {
      Typescript,
      Javascript,
      Python,
      CSS
    };
    const quickPick = window.createQuickPick();
    quickPick.items = Object.keys(options).map((label) => ({ label }));
    quickPick.onDidChangeSelection((selection) => {
      if (selection[0]) {
        options[selection[0].label](context).catch(console.error);
      }
    });
    quickPick.onDidHide(() => quickPick.dispose());
    quickPick.show();
    window.showInformationMessage('You will have to reload the window');
  });
  context.subscriptions.push(disposable);
  context.subscriptions.push(deleted);
}
export function deactivate() {}
