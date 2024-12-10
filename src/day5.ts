import * as fs from "fs";
import * as path from "path";

const inputPath = path.join(__dirname, "../input/day5.txt");
const input = fs.readFileSync(inputPath, "utf8");

const [firstSection, secondSection] = input.split("\n\n");

const pageOrderRules: Map<number, number[]> = new Map();
firstSection!
  .split("\n")
  .map((line) => line.split("|"))
  .forEach(([first, second]) => {
    if (!pageOrderRules.has(parseInt(second!))) {
      pageOrderRules.set(parseInt(second!), []);
    }
    pageOrderRules.get(parseInt(second!))!.push(parseInt(first!));
  });

const pageUpdates = secondSection!
  .split("\n")
  .map((update) => update.split(",").map((page) => parseInt(page!)));

const checkValidUpdate = (update: number[]): boolean => {
  for (let i = 0; i < update.length; i++) {
    for (let j = i + 1; j < update.length; j++) {
      const pageRules = pageOrderRules.get(update[i]!);
      if (pageRules && pageRules.includes(update[j]!)) {
        return false;
      }
    }
  }
  return true;
};

let validUpdateSum = 0;
const incorrectUpdates: number[][] = [];

for (const update of pageUpdates) {
  if (checkValidUpdate(update)) {
    const middlePage = update[Math.floor(update.length / 2)]!;
    validUpdateSum += middlePage;
  } else {
    incorrectUpdates.push(update);
  }
}

console.log(`Part 1: ${validUpdateSum}`);

const fixIncorrectUpdate = (update: number[]): number[] => {
  const fixedUpdate = [...update];

  let swapped;
  do {
    swapped = false;
    for (let i = 0; i < fixedUpdate.length - 1; i++) {
      const nextPageRules = pageOrderRules.get(fixedUpdate[i + 1]!);
      if (nextPageRules && nextPageRules.includes(fixedUpdate[i]!)) continue;

      const currentPageRules = pageOrderRules.get(fixedUpdate[i]!);
      if (currentPageRules && currentPageRules.includes(fixedUpdate[i + 1]!)) {
        [fixedUpdate[i], fixedUpdate[i + 1]] = [
          fixedUpdate[i + 1]!,
          fixedUpdate[i]!,
        ];
        swapped = true;
      }
    }
  } while (swapped);

  return fixedUpdate;
};

let invalidUpdateSum = 0;

for (const update of incorrectUpdates) {
  const fixedUpdate = fixIncorrectUpdate(update);
  invalidUpdateSum += fixedUpdate[Math.floor(fixedUpdate.length / 2)]!;
}

console.log(`Part 2: ${invalidUpdateSum}`);
