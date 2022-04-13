import {
  ExtensionContext,
  commands,
  window,
} from "vscode";
import {python as Python} from './python';
import {javascript as Javascript} from './javascript';
import {css as CSS} from './css';
import {typescript as Typescript} from './typescript';

export function activate(context: ExtensionContext) {
  let disposable = commands.registerCommand("templating.createSnippet", () => {
    // Prompt user to enter which language they want to create a snippet for
    const options: {
      [key: string]: (context: ExtensionContext) => Promise<void>;
    } = {
      Python,
      Javascript,
      CSS,
      Typescript
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
    // Ask them to reload window?
  });
  context.subscriptions.push(disposable);
}
export function deactivate() {}
