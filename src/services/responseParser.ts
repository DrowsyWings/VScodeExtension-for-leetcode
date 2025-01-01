// interface TestCase {
//     input: string;
//     output: string;
//   }

// export const extractTestCases = (content: string): TestCase[] => {
//     const preRegex = /<pre>\s*([\s\S]*?)\s*<\/pre>/g;
//     const inputOutputRegex = /<strong>Input:<\/strong>\s*([\s\S]*?)\s*<strong>Output:<\/strong>\s*([\s\S]*?)(?=\s*(?:<strong>|$))/g;

//     const testCases: TestCase[] = [];
//     let preMatch: RegExpExecArray | null;

//     while ((preMatch = preRegex.exec(content)) !== null) {
//       const preContent: string = preMatch[1];
//       let ioMatch: RegExpExecArray | null;

//       // Then extract Input/Output pairs from each <pre> block
//       while ((ioMatch = inputOutputRegex.exec(preContent)) !== null) {
//         const input: string = ioMatch[1].trim();
//         const output: string = ioMatch[2].trim();
//         testCases.push({ input, output });
//       }
//     }

//     return testCases;
//   };

// //   const problemContent: string = `<p>Given an array of integers <code>nums</code>&nbsp;and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>

// //   <p><strong class=\"example\">Example 1:</strong></p>

// //   <pre>
// //   <strong>Input:</strong> nums = [2,7,11,15], target = 9
// //   <strong>Output:</strong> [0,1]
// //   <strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].
// //   </pre>

// //   <p><strong class=\"example\">Example 2:</strong></p>

// //   <pre>
// //   <strong>Input:</strong> nums = [3,2,4], target = 6
// //   <strong>Output:</strong> [1,2]
// //   </pre>`;
