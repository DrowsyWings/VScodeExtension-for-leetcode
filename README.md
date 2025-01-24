# LeetCode CPH Extension for VSCode

This extension is designed to help competitive programmers and developers practice and solve LeetCode problems directly within Visual Studio Code. It supports C++ and Python, allowing users to fetch problem statements, test cases, and run their solutions locally. The extension provides a seamless workflow for debugging and verifying solutions against expected outputs.

---

## Features

1. **Fetch Problem Statement and Test Cases:**

   - Users can fetch problem statements and test cases directly from LeetCode by providing the problem URL.
   - The extension uses LeetCode's GraphQL API to extract and store test cases locally.

2. **Write and Test Code:**

   - Users can write their solutions in C++ or Python.
   - The extension allows users to run their code against the fetched test cases to verify correctness.

3. **View Results:**
   - The extension compares the actual output of the user's code with the expected output for each test case.
   - Discrepancies are highlighted to assist with debugging.

---

## Workflow

1. **Fetch Test Cases:**

   - Run the command `CPH: Fetch Test Cases`.
   - Input the LeetCode problem URL.
   - The extension extracts and stores the test cases locally.

2. **Write and Test Code:**

   - Write your solution in the editor.
   - Run the command `CPH: Run Test Cases` to test your solution locally.

3. **View Results:**
   - The extension displays a comparison of actual vs expected outputs.
   - Debug discrepancies directly in the editor.

---

## Project Structure

The project is organized as follows:

```
├── CHANGELOG.md                  # Changelog for the extension
├── eslint.config.mjs             # ESLint configuration
├── package.json                  # NPM package configuration
├── package-lock.json             # Lock file for dependencies
├── README.md                     # This file
├── src                           # Source code directory
│   ├── commands                  # Command handlers
│   │   ├── fetchTestCases.ts     # Handles fetching test cases
│   │   └── runTestCases.ts       # Handles running test cases (currently empty)
│   ├── extension.ts              # Entry point for the extension
│   ├── services                  # Service layer for core functionality
│   │   ├── codeExecutor.ts       # Handles code execution (currently empty)
│   │   ├── fileHandler.ts        # Handles file operations
│   │   ├── leetCodeScraper.ts    # Handles scraping LeetCode data
│   ├── test                      # Test files
│   │   └── extension.test.ts     # Unit tests for the extension
│   └── ui                        # User interface components
│       ├── layoutManager.ts      # Manages UI layout
│       └── webView.ts            # Handles webview rendering
├── tsconfig.json                 # TypeScript configuration
└── vsc-extension-quickstart.md   # Quickstart guide for VSCode extensions
```

---

## Getting Started

### Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/)
- Node.js and npm installed
- TypeScript installed globally (`npm install -g typescript`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/leetcode-cph-extension.git
   ```
2. Navigate to the project directory:
   ```bash
   cd leetcode-cph-extension
   ```
3. Install dependencies:
   ```bash
   yarn install
   ```
4. Open the project in Visual Studio Code:
   ```bash
   code .
   ```

### Building the Extension

1. Run the extension in debug mode:
   - Press `F5` in Visual Studio Code to launch the extension in a new window.

### Usage

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
2. Run the command `CPH: Fetch Test Cases` and provide the LeetCode problem URL.
3. Write your solution in the editor.
4. Run the command `CPH: Run Test Cases` to test your solution locally.
5. View the results in the output panel.
6. To open the panel again, run the command `CPH: Reveal Test Cases`.

---

## Acknowledgments

- Inspired by [Competitive Programming Helper (CPH)](https://github.com/agrawal-d/competitive-programming-helper).
- Uses LeetCode's GraphQL API for fetching problem data.

---
