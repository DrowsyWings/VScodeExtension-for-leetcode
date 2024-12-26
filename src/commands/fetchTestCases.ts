import * as vscode from "vscode";
import { testCaseFromUrl } from "../services/leetCodeScraper";

function isValidLeetCodeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname === "leetcode.com" &&
      parsed.pathname.startsWith("/problems/")
    );
  } catch {
    return false;
  }
}

export async function fetchTestCases() {
  try {
    const questionLink = await vscode.window.showInputBox({
      placeHolder: "https://leetcode.com/problems/two-sum",
      prompt: "Please enter the LeetCode problem URL.",
    });
    if (questionLink === "" || questionLink === undefined) {
      vscode.window.showErrorMessage("No URL entered. Please try again.");
      return;
    }
    // TODO: Add logic to validate the URL
    const validUrl = isValidLeetCodeUrl(questionLink);
    if (!validUrl) {
      vscode.window.showErrorMessage(
        "Failed to fetch the test cases try again"
      );
      return;
    }
    testCaseFromUrl(questionLink);
    vscode.window.showInformationMessage(
      `Fetching test cases for: ${questionLink}`
    );
  } catch (error) {
    vscode.window.showErrorMessage(`An error occurred: ${error}`);
  }
}
