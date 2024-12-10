import * as fs from "fs";
import * as path from "path";

const inputPath = path.join(__dirname, "../input/day1.txt");
const input = fs.readFileSync(inputPath, "utf8");

const lines = input
  .split("\n")
  .map((line) => line.split("   ").map((num) => parseInt(num) || 0));

const [leftArray, rightArray] = lines.reduce(
  ([left, right], nums) => {
    if (nums[0] !== undefined) left.push(nums[0]);
    if (nums[1] !== undefined) right.push(nums[1]);
    return [left, right];
  },
  [[], []] as [number[], number[]]
);

leftArray.sort((a, b) => a - b);
rightArray.sort((a, b) => a - b);

let totalDifference = 0;

for (let i = 0; i < leftArray.length; i++) {
  totalDifference += Math.abs(leftArray[i]! - rightArray[i]!);
}

console.log(`part 1: ${totalDifference}`);

let similarityScore = 0;

const rightArrayRepetitionMap: { [key: number]: number } = {};

for (const num of rightArray) {
  rightArrayRepetitionMap[num] = (rightArrayRepetitionMap[num] || 0) + 1;
}

for (const num of leftArray) {
  similarityScore += num * (rightArrayRepetitionMap[num] || 0);
}

console.log(`part 2: ${similarityScore}`);
