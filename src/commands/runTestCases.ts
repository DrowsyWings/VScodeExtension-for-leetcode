// src/commands/runTestCases.ts
import * as vscode from "vscode";
import { CodeExecutor } from "../services/codeExectuor";
import { TestCasesPanel } from "../ui/webView";

export async function runTestCases() {
  try {
    // Get the active editor
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      throw new Error("No active editor found");
    }

    // Get the full file path
    const filePath = editor.document.uri.fsPath;

    // Determine the language from the file extension
    const fileExtension = filePath.split(".").pop()?.toLowerCase();

    let language: string;
    switch (fileExtension) {
      case "cpp":
        language = "cpp";
        break;
      case "py":
        language = "python";
        break;
      default:
        throw new Error(
          "Unsupported file type. Only C++ and Python are supported."
        );
    }

    // Save the current file
    await editor.document.save();

    // Execute the code
    const executor = new CodeExecutor();
    await executor.executeCode(filePath, language);

    // Update the webview panel
    const panel = TestCasesPanel.createOrShow();
    await panel.updateContent();

    vscode.window.showInformationMessage("Test cases executed successfully!");
  } catch (error: any) {
    vscode.window.showErrorMessage(
      `Failed to run test cases: ${error.message}`
    );
  }
}
