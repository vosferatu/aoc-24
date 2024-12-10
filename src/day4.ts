import * as fs from "fs";
import * as path from "path";

const inputPath = path.join(__dirname, "../input/day4.txt");
const input = fs.readFileSync(inputPath, "utf8");

const grid = input.split("\n").map((line) => line.split(""));

const word = "XMAS";
const wordLength = word.length;

const directions = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

function checkWord(row: number, col: number, dir: number[]): boolean {
  for (let i = 0; i < wordLength; i++) {
    const newRow = row + i * dir[0]!;
    const newCol = col + i * dir[1]!;
    if (
      newRow < 0 ||
      newRow >= grid.length ||
      newCol < 0 ||
      newCol >= grid[0]!.length ||
      grid[newRow]![newCol] !== word[i]
    ) {
      return false;
    }
  }
  return true;
}

let count = 0;
for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[row]!.length; col++) {
    if (grid[row]![col] !== "X") continue;
    for (const dir of directions) {
      if (checkWord(row, col, dir)) {
        count++;
      }
    }
  }
}

console.log(`Part 1: ${count}`);

count = 0;

function checkXMAS(row: number, col: number): boolean {
  const combinations = [
    [
      [-1, -1, "M"],
      [1, 1, "S"],
    ],
    [
      [-1, -1, "S"],
      [1, 1, "M"],
    ],
    [
      [-1, 1, "M"],
      [1, -1, "S"],
    ],
    [
      [-1, 1, "S"],
      [1, -1, "M"],
    ],
  ];

  if (
    combinations
      .slice(0, 2)
      .some((p) =>
        p.every(
          ([dr, dc, ch]) => grid[row + Number(dr)]![col + Number(dc)] === ch
        )
      ) &&
    combinations
      .slice(2, 4)
      .some((p) =>
        p.every(
          ([dr, dc, ch]) => grid[row + Number(dr)]![col + Number(dc)] === ch
        )
      )
  ) {
    return true;
  }

  return false;
}

for (let row = 1; row < grid.length - 1; row++) {
  for (let col = 1; col < grid[0]!.length - 1; col++) {
    if (grid[row]![col] !== "A") continue;
    if (checkXMAS(row, col)) {
      count++;
    }
  }
}

console.log(`Part 2: ${count}`);
