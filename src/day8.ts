import * as fs from "fs";
import * as path from "path";

const inputPath = path.join(__dirname, "../input/day8.txt");
const input = fs.readFileSync(inputPath, "utf8");

const grid = input.split("\n").map((line) => line.split(""));

const width = grid[0]!.length;
const height = grid.length;
const frequencies: { [key: string]: { x: number; y: number }[] } = {};

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (grid[y]![x] !== ".") {
      if (!frequencies[grid[y]![x]!]) frequencies[grid[y]![x]!] = [];
      frequencies[grid[y]![x]!]!.push({ x, y });
    }
  }
}

const getDistanceAntinodes = (frequency: string) => {
  const antinodes = new Set<string>();
  for (let i = 0; i < frequencies[frequency]!.length; i++) {
    for (let j = 0; j < frequencies[frequency]!.length; j++) {
      if (i === j) continue;

      const dx = frequencies[frequency]![j]!.x - frequencies[frequency]![i]!.x;
      const dy = frequencies[frequency]![j]!.y - frequencies[frequency]![i]!.y;

      const antinodeX = frequencies[frequency]![i]!.x + dx * 2;
      const antinodeY = frequencies[frequency]![i]!.y + dy * 2;

      if (
        antinodeX >= 0 &&
        antinodeX < width &&
        antinodeY >= 0 &&
        antinodeY < height
      )
        antinodes.add(`${antinodeX},${antinodeY}`);
    }
  }

  return antinodes;
};

let antinodes = new Set<string>();
for (const frequency of Object.keys(frequencies)) {
  const freqAntinodes = getDistanceAntinodes(frequency);
  freqAntinodes.forEach((node) => antinodes.add(node));
}

console.log(`Part 1: ${antinodes.size}`);

const getAllAntinodes = (frequency: string) => {
  const antinodes = new Set<string>();
  for (let i = 0; i < frequencies[frequency]!.length; i++) {
    for (let j = 0; j < frequencies[frequency]!.length; j++) {
      if (i === j) continue;

      const dx = frequencies[frequency]![j]!.x - frequencies[frequency]![i]!.x;
      const dy = frequencies[frequency]![j]!.y - frequencies[frequency]![i]!.y;

      for (let k = -height; k <= height; k++) {
        const antinodeX = frequencies[frequency]![i]!.x + dx * k;
        const antinodeY = frequencies[frequency]![i]!.y + dy * k;

        if (
          antinodeX >= 0 &&
          antinodeX < width &&
          antinodeY >= 0 &&
          antinodeY < height
        )
          antinodes.add(`${antinodeX},${antinodeY}`);
      }
    }
  }

  return antinodes;
};

antinodes.clear();
for (const frequency of Object.keys(frequencies)) {
  const freqAntinodes = getAllAntinodes(frequency);
  freqAntinodes.forEach((node) => antinodes.add(node));
}

console.log(`Part 2: ${antinodes.size}`);
