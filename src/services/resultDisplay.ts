import * as vscode from "vscode";

interface TestResult {
  testCase: number;
  passed: boolean;
}

interface TestOutput {
  expectedOutput: string;
  actualOutput: string;
}

export class ResultsDisplayService {
  private statusBarItem: vscode.StatusBarItem;
  private outputChannel: vscode.OutputChannel;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      100
    );
    this.outputChannel = vscode.window.createOutputChannel("Test Results");
  }

  displayResults(allTestsPassed: boolean) {
    if (allTestsPassed) {
      vscode.window.showInformationMessage("All test cases passed! 🎉");
    } else {
      vscode.window.showErrorMessage(
        "Some test cases failed. Please check your code. ❌"
      );
    }
  }

  updateStatusBar(allTestsPassed: boolean) {
    this.statusBarItem.text = allTestsPassed
      ? "$(check) All tests passed!"
      : "$(x) Some tests failed.";
    this.statusBarItem.tooltip = "Click to view details";
    this.statusBarItem.show();
  }

  writeResultsToOutputPanel(results: TestResult[], outputs: TestOutput[]) {
    this.outputChannel.clear();
    this.outputChannel.appendLine("========== Test Results ==========");
    results.forEach((result, index) => {
      const { testCase, passed } = result;
      const { expectedOutput, actualOutput } = outputs[index];

      if (passed) {
        this.outputChannel.appendLine(`Test Case ${index + 1}: ✅ Passed`);
      } else {
        this.outputChannel.appendLine(`Test Case ${index + 1}: ❌ Failed`);
        this.outputChannel.appendLine(`Expected: ${expectedOutput}`);
        this.outputChannel.appendLine(` Actual : ${actualOutput}`);
      }
    });
    this.outputChannel.show();
  }

  dispose() {
    this.statusBarItem.dispose();
    this.outputChannel.dispose();
  }
}
