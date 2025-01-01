import * as vscode from "vscode";
import * as fs from "fs/promises";
import * as path from "path";
import { spawn } from "child_process";
import { ResultsDisplayService } from "./resultDisplay";

export class CodeExecutor {
  private workspacePath: string;
  private resultsDisplay: ResultsDisplayService;

  constructor() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      throw new Error("No workspace folder found");
    }
    this.workspacePath = workspaceFolder.uri.fsPath;
    this.resultsDisplay = new ResultsDisplayService();
  }

  async executeCode(filePath: string, language: string): Promise<void> {
    try {
      switch (language) {
        case "cpp":
          await this.runCpp(filePath);
          break;
        case "python":
          await this.runPython(filePath);
          break;
        default:
          throw new Error(`Unsupported language: ${language}`);
      }
    } catch (error: any) {
      vscode.window.showErrorMessage(`Execution error: ${error.message}`);
    }
  }

  private async runCpp(filePath: string): Promise<void> {
    const testCasesDir = path.join(this.workspacePath, "test_cases");
    const executableFile = path.join(path.dirname(filePath), "solution");

    // Compile C++ code
    await new Promise<void>((resolve, reject) => {
      const compileProcess = spawn("g++", [filePath, "-o", executableFile]);

      compileProcess.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error("Compilation failed"));
        }
      });

      compileProcess.stderr.on("data", (data) => {
        reject(new Error(`Compilation error: ${data.toString()}`));
      });
    });

    await this.runTests(executableFile, testCasesDir, "cpp");
  }

  private async runPython(filePath: string): Promise<void> {
    const testCasesDir = path.join(this.workspacePath, "test_cases");
    await this.runTests(filePath, testCasesDir, "python");
  }

  private async runTests(
    executablePath: string,
    testCasesDir: string,
    language: string
  ): Promise<void> {
    const inputPath = path.join(testCasesDir, "input.txt");
    const expectedOutputPath = path.join(testCasesDir, "expected_output.txt");

    const input = await fs.readFile(inputPath, "utf8");
    const expectedOutput = await fs.readFile(expectedOutputPath, "utf8");

    const testCases = input.trim().split("\n");
    const expectedOutputs = expectedOutput.trim().split("\n");

    let allTestsPassed = true;
    const results = [];
    const outputs = [];

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const expected = expectedOutputs[i].trim();

      const actual = await this.executeSingleTest(
        executablePath,
        testCase,
        language
      );

      const passed = actual.trim() === expected;
      if (!passed) {
        allTestsPassed = false;
      }

      results.push({ testCase: i + 1, passed });
      outputs.push({ expectedOutput: expected, actualOutput: actual.trim() });
    }

    // Display results
    this.resultsDisplay.displayResults(allTestsPassed);
    this.resultsDisplay.updateStatusBar(allTestsPassed);
    this.resultsDisplay.writeResultsToOutputPanel(results, outputs);
  }

  private async executeSingleTest(
    executablePath: string,
    input: string,
    language: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const cmd = language === "python" ? "python3" : executablePath;
      const args = language === "python" ? [executablePath] : [];
      const process = spawn(cmd, args, {
        cwd: path.dirname(executablePath),
      });

      let output = "";
      let error = "";

      process.stdout.on("data", (data) => {
        output += data.toString();
      });

      process.stderr.on("data", (data) => {
        error += data.toString();
      });

      process.on("close", (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`Process failed with error: ${error}`));
        }
      });

      process.on("error", reject);

      const timeout = setTimeout(() => {
        process.kill();
        reject(new Error("Process timed out"));
      }, 5000);

      process.stdin.write(input);
      process.stdin.end();

      process.on("close", () => {
        clearTimeout(timeout);
      });
    });
  }

  dispose() {
    this.resultsDisplay.dispose();
  }
}
