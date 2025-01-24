import * as vscode from "vscode";
import * as fs from "fs/promises";
import * as path from "path";

export class TestCasesPanel {
  private static currentPanel: TestCasesPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  private constructor(panel: vscode.WebviewPanel) {
    this._panel = panel;
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._panel.webview.html = this._getWebviewContent();
    this.setupWebviewMessageListener();
  }

  public static reveal() {
    const panel = TestCasesPanel.createOrShow();
    panel.updateContent();
    return panel;
  }

  public static createOrShow() {
    const column = vscode.ViewColumn.Two;

    if (TestCasesPanel.currentPanel) {
      TestCasesPanel.currentPanel._panel.reveal(column, true);
      return TestCasesPanel.currentPanel;
    }

    const panel = vscode.window.createWebviewPanel(
      "testCases",
      "Test Cases",
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );

    TestCasesPanel.currentPanel = new TestCasesPanel(panel);
    return TestCasesPanel.currentPanel;
  }

  public async updateContent() {
    try {
      const workspace = vscode.workspace.workspaceFolders?.[0];
      if (!workspace) {
        throw new Error("No workspace folder found");
      }

      const testCasesPath = path.join(workspace.uri.fsPath, "test_cases");

      try {
        await fs.access(testCasesPath);
      } catch {
        throw new Error("Test cases folder not found");
      }

      const inputPath = path.join(testCasesPath, "input.txt");
      const expectedOutputPath = path.join(
        testCasesPath,
        "expected_output.txt"
      );

      let input = "";
      let expectedOutput = "";

      try {
        input = await fs.readFile(inputPath, "utf8");
      } catch {
        throw new Error("input.txt not found in test_cases folder");
      }

      try {
        expectedOutput = await fs.readFile(expectedOutputPath, "utf8");
      } catch {
        throw new Error("expected_output.txt not found in test_cases folder");
      }

      this._panel.webview.postMessage({
        type: "update",
        input,
        expectedOutput,
      });
    } catch (error) {
      this._panel.webview.postMessage({
        type: "error",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private async saveInput(input: string) {
    try {
      const workspace = vscode.workspace.workspaceFolders?.[0];
      if (!workspace) {
        throw new Error("No workspace folder found");
      }

      const inputPath = path.join(
        workspace.uri.fsPath,
        "test_cases",
        "input.txt"
      );
      await fs.writeFile(inputPath, input, "utf8");
      vscode.window.showInformationMessage("Test cases updated successfully!");
    } catch (error) {
      vscode.window.showErrorMessage(`Error saving input: ${error}`);
    }
  }

  private _getWebviewContent() {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: var(--vscode-font-family); 
              padding: 20px; 
              color: var(--vscode-foreground);
            }
            .container { 
              display: flex; 
              flex-direction: column; 
              gap: 20px; 
            }
            .section { 
              background: var(--vscode-editor-background); 
              padding: 15px; 
              border-radius: 5px;
            }
            h3 { 
              margin-top: 0; 
              color: var(--vscode-foreground);
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            textarea {
              width: 100%;
              min-height: 100px;
              background: var(--vscode-input-background);
              color: var(--vscode-input-foreground);
              border: 1px solid var(--vscode-input-border);
              padding: 8px;
              font-family: var(--vscode-editor-font-family);
              resize: vertical;
            }
            pre { 
              white-space: pre-wrap; 
              word-wrap: break-word; 
              margin: 0;
              padding: 8px;
              background: var(--vscode-input-background);
              border: 1px solid var(--vscode-input-border);
            }
            button {
              background: var(--vscode-button-background);
              color: var(--vscode-button-foreground);
              border: none;
              padding: 4px 12px;
              border-radius: 3px;
              cursor: pointer;
            }
            button:hover {
              background: var(--vscode-button-hoverBackground);
            }
            .error {
              color: var(--vscode-errorForeground);
              background: var(--vscode-errorBackground);
              padding: 10px;
              border-radius: 5px;
              border: 1px solid var(--vscode-errorBorder);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="section">
              <h3>
                Test Cases Input
                <button id="saveInput">Save Changes</button>
              </h3>
              <textarea id="input" placeholder="Enter your test cases here..."></textarea>
              <div style="margin-top: 10px;">
                <small>Each line represents a new test case. Save changes to update the test file.</small>
              </div>
            </div>
            <div class="section">
              <h3>Expected Output</h3>
              <pre id="expected-output"></pre>
            </div>
            <div id="error-message" class="error" style="display: none;"></div>
          </div>
          <script>
            const vscode = acquireVsCodeApi();
            const inputTextarea = document.getElementById('input');
            const saveButton = document.getElementById('saveInput');
            const errorMessage = document.getElementById('error-message');

            saveButton.addEventListener('click', () => {
              vscode.postMessage({
                type: 'saveInput',
                value: inputTextarea.value
              });
            });

            window.addEventListener('message', event => {
              const message = event.data;
              if (message.type === 'update') {
                inputTextarea.value = message.input;
                document.getElementById('expected-output').textContent = message.expectedOutput;
                errorMessage.style.display = 'none';
              } else if (message.type === 'error') {
                errorMessage.textContent = message.message;
                errorMessage.style.display = 'block';
              }
            });

            inputTextarea.addEventListener('input', function() {
              this.style.height = 'auto';
              this.style.height = (this.scrollHeight) + 'px';
            });
          </script>
        </body>
      </html>
    `;
  }

  private setupWebviewMessageListener() {
    this._panel.webview.onDidReceiveMessage(
      async (message) => {
        switch (message.type) {
          case "refresh":
            await this.updateContent();
            break;
          case "saveInput":
            await this.saveInput(message.value);
            break;
        }
      },
      null,
      this._disposables
    );
  }

  public dispose() {
    TestCasesPanel.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
}
