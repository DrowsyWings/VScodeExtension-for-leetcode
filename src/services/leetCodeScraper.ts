import axios from "axios";
import { extractTestCases } from "./responseParser";

const graphqlEndpoint = "https://leetcode.com/graphql";
const query = `
query getQuestionDetail($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    content
  }
}
`;

export async function testCaseFromUrl(url: string): Promise<any> {
  try {
    const problemName = extractProblemName(url);

    try {
      const response = await axios.post(graphqlEndpoint, {
        query,
        variables: { titleSlug: problemName },
      });

      const content = response.data.data.question.content;
      const testCases = extractTestCases(content);
      return testCases;
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
}

export function extractProblemName(url: string): string {
  const match = url.match(/https:\/\/leetcode\.com\/problems\/([^\/]+)\//);
  if (match && match[1]) {
    return match[1];
  }
  throw new Error("Invalid LeetCode URL format");
}
