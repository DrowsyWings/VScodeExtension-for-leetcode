import * as vscode from "vscode";
import { fetchTestCases } from "./commands/fetchTestCases";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "cph-for-leetcode" is now active!'
  );

  const disposable = vscode.commands.registerCommand(
    "cph.FetchTestCases",
    fetchTestCases
  );

  // const disposable2 = vscode.commands.registerCommand('hello2-from-leetcode',()=>{
  // 	vscode.window.showInformationMessage('The Second command');
  // });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
