import * as fs from "fs";
import * as path from "path";

const inputPath = path.join(__dirname, "../input/day10.txt");
const input = fs.readFileSync(inputPath, "utf8");

const grid = input.split("\n").map((line) => line.split("").map(Number));

const findTrails = (x: number, y: number) => {
  const directions = {
    up: [-1, 0],
    right: [0, 1],
    down: [1, 0],
    left: [0, -1],
  };

  const toVisit: [number, number, number][] = [];
  const visited = new Set<string>();

  const getDirections = (x: number, y: number, currentValue: number) => {
    const validDirections: [number, number, number][] = [];
    for (const [dy, dx] of Object.values(directions)) {
      const newX = x + dx!;
      const newY = y + dy!;
      const nextValue = currentValue + 1;
      const key = `${newX},${newY},${nextValue}`;

      if (
        newX >= 0 &&
        newX < grid[y]!.length &&
        newY >= 0 &&
        newY < grid.length &&
        grid[newY]![newX]! === nextValue &&
        !visited.has(key)
      ) {
        validDirections.push([newX, newY, nextValue]);
        visited.add(key);
      }
    }
    return validDirections;
  };

  getDirections(x, y, 0).forEach(([dx, dy, target]) => {
    toVisit.push([dx!, dy!, target!]);
  });

  let trails = 0;
  do {
    const [x, y, currentValue] = toVisit.shift()!;

    if (y < 0 || y >= grid.length || x < 0 || x >= grid[y]!.length) {
      continue;
    }

    if (currentValue === 9) {
      trails++;
      continue;
    }

    toVisit.push(...getDirections(x, y, currentValue));
  } while (toVisit.length > 0);

  return trails;
};

let total = 0;
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y]!.length; x++) {
    if (grid[y]![x] === 0) {
      total += findTrails(x, y);
    }
  }
}

console.log(`part 1 ${total}`);

const findTrailRatings = (x: number, y: number) => {
  const directions = {
    up: [-1, 0],
    right: [0, 1],
    down: [1, 0],
    left: [0, -1],
  };

  const toVisit: [number, number, number][] = [];

  const getDirections = (x: number, y: number, currentValue: number) => {
    const validDirections: [number, number, number][] = [];
    for (const [dy, dx] of Object.values(directions)) {
      const newX = x + dx!;
      const newY = y + dy!;
      const nextValue = currentValue + 1;

      if (
        newX >= 0 &&
        newX < grid[y]!.length &&
        newY >= 0 &&
        newY < grid.length &&
        grid[newY]![newX]! === nextValue
      ) {
        validDirections.push([newX, newY, nextValue]);
      }
    }
    return validDirections;
  };

  getDirections(x, y, 0).forEach(([dx, dy, target]) => {
    toVisit.push([dx!, dy!, target!]);
  });

  let trails = 0;
  do {
    const [x, y, currentValue] = toVisit.shift()!;

    if (y < 0 || y >= grid.length || x < 0 || x >= grid[y]!.length) {
      continue;
    }

    if (currentValue === 9) {
      trails++;
      continue;
    }

    toVisit.push(...getDirections(x, y, currentValue));
  } while (toVisit.length > 0);

  return trails;
};

total = 0;
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y]!.length; x++) {
    if (grid[y]![x] === 0) {
      total += findTrailRatings(x, y);
    }
  }
}

console.log(`part 2 ${total}`);
