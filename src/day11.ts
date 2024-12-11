import * as fs from "fs";
import * as path from "path";

const inputPath = path.join(__dirname, "../input/day11.txt");
const input = fs.readFileSync(inputPath, "utf8");

const blink = (numbers: string[], numIterations: number) => {
  let stoneCount = new Map<string, number>();

  for (const num of numbers) {
    stoneCount.set(num, 1);
  }

  do {
    const currentCount = new Map<string, number>();

    for (const [num, count] of stoneCount.entries()) {
      if (num === "0") {
        currentCount.set("1", (currentCount.get("1") ?? 0) + count);
        continue;
      }

      if (num.length % 2 === 0) {
        const left = num.substring(0, num.length / 2);
        const right = Number(num.substring(num.length / 2)).toString();

        currentCount.set(left, (currentCount.get(left) ?? 0) + count);
        currentCount.set(right, (currentCount.get(right) ?? 0) + count);
        continue;
      }

      const newNum = (Number(num) * 2024).toString();
      currentCount.set(newNum, (currentCount.get(newNum) ?? 0) + count);
    }

    stoneCount = currentCount;
    numIterations--;
  } while (numIterations > 0);

  return Array.from(stoneCount.values()).reduce((a, b) => a + b, 0);
};

console.time("part 1");
console.log(`part 1: ${blink(input.split(" "), 25)}`);
console.timeEnd("part 1");

console.time("part 2");
console.log(`part 2: ${blink(input.split(" "), 75)}`);
console.timeEnd("part 2");
