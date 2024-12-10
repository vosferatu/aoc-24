import * as fs from "fs";
import * as path from "path";

const inputPath = path.join(__dirname, "../input/day6.txt");
const input = fs.readFileSync(inputPath, "utf8");

const grid = input.split("\n").map((line) => line.split(""));
const maxY = grid.length;
const maxX = grid[0]!.length;

console.time("part 1 time");

const guardChars = ["^", ">", "v", "<"];
const directions = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const guardPositions = new Set<string>();

let currentGuardPosition: [number, number] = [0, 0];
let currentGuardCharIndex = 0;

for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y]!.length; x++) {
    const cell = grid[y]![x];
    if (guardChars.includes(cell!)) {
      guardPositions.add(`${y},${x}`);
      currentGuardCharIndex = guardChars.indexOf(cell!);
      currentGuardPosition = [y, x];
      break;
    }
  }
}

const guardStartPosition = `${currentGuardPosition[0]},${currentGuardPosition[1]}`;
const guardStartCharIndex = currentGuardCharIndex;

while (true) {
  if (
    currentGuardPosition[0] < 0 ||
    currentGuardPosition[1] < 0 ||
    currentGuardPosition[0] >= maxY ||
    currentGuardPosition[1] >= maxX
  ) {
    break;
  }

  if (
    currentGuardPosition[0] + directions[currentGuardCharIndex]![0]! < 0 ||
    currentGuardPosition[1] + directions[currentGuardCharIndex]![1]! < 0 ||
    currentGuardPosition[0] + directions[currentGuardCharIndex]![0]! >= maxY ||
    currentGuardPosition[1] + directions[currentGuardCharIndex]![1]! >= maxX
  ) {
    break;
  }

  if (
    grid[currentGuardPosition[0] + directions[currentGuardCharIndex]![0]!]![
      currentGuardPosition[1] + directions[currentGuardCharIndex]![1]!
    ] === "#"
  ) {
    currentGuardCharIndex = (currentGuardCharIndex + 1) % 4;
    continue;
  }

  currentGuardPosition = [
    currentGuardPosition[0] + directions[currentGuardCharIndex]![0]!,
    currentGuardPosition[1] + directions[currentGuardCharIndex]![1]!,
  ];

  guardPositions.add(`${currentGuardPosition[0]},${currentGuardPosition[1]}`);
}
console.timeEnd("part 1 time");
console.log(`part 1: ${guardPositions.size}`);

const checkLoop = (sampleGrid: string[][]) => {
  const loopGuardPositions = new Set<string>();

  let loopPosition: [number, number] = guardStartPosition
    .split(",")
    .map(Number) as [number, number];
  let loopGuardCharIndex = guardStartCharIndex;

  while (true) {
    const [dy, dx] = directions[loopGuardCharIndex]!;
    const [y, x] = loopPosition;
    const nextPosition: [number, number] = [y + dy!, x + dx!];

    if (
      nextPosition[0]! < 0 ||
      nextPosition[1]! < 0 ||
      nextPosition[0]! >= maxY ||
      nextPosition[1]! >= maxX
    ) {
      return false;
    }

    if (sampleGrid[nextPosition[0]!]![nextPosition[1]!] !== "#") {
      const state = `${nextPosition[0]},${nextPosition[1]},${loopGuardCharIndex}`;
      if (loopGuardPositions.has(state)) {
        return true;
      }
      loopGuardPositions.add(state);
      loopPosition = nextPosition;
    } else {
      loopGuardCharIndex = (loopGuardCharIndex + 1) % 4;
    }
  }
};

console.time("part 2 time");

let loopCount = 0;

guardPositions.delete(guardStartPosition);
for (const guardPosition of guardPositions) {
  const [y, x] = guardPosition.split(",").map(Number);

  const sampleGrid = structuredClone(grid);
  sampleGrid[y!]![x!] = "#";
  if (checkLoop(sampleGrid)) {
    loopCount++;
  }
}

console.timeEnd("part 2 time");
console.log(`part 2: ${loopCount}`);
