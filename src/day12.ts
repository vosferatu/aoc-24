import * as fs from "fs";
import * as path from "path";

const inputPath = path.join(__dirname, "../input/day12.txt");
const input = fs.readFileSync(inputPath, "utf8");

const grid = input.split("\n").map((row) => row.split(""));

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const getDirections = (x: number, y: number) => {
  return directions.map(([dx, dy]) => [x + dx!, y + dy!]);
};

type RegionPerimeter = Region & {
  perimeter: number;
};

type RegionSide = Region & {
  side: number;
};

type Region = {
  plant: string;
  area: number;
};

const getFencingRegionsPerimeter = (
  grid: string[][]
): Map<string, RegionPerimeter[]> => {
  const visited = new Set<string>();
  const regions = new Map<string, RegionPerimeter[]>();

  const getRegion = (x: number, y: number): RegionPerimeter => {
    const queue: [number, number][] = [];
    const region: RegionPerimeter = {
      plant: grid[y]![x]!,
      area: 0,
      perimeter: 0,
    };
    queue.push([x, y]);

    while (queue.length > 0) {
      const [x, y] = queue.shift()!;
      if (visited.has(`${y},${x}`)) continue;
      region.area++;

      visited.add(`${y},${x}`);

      const directions = getDirections(x, y);

      for (const [dx, dy] of directions) {
        if (
          dx! < 0 ||
          dy! < 0 ||
          dx! >= grid[y]!.length ||
          dy! >= grid.length ||
          grid[dy!]![dx!] !== region.plant
        ) {
          region.perimeter++;
        }

        if (dx! < 0 || dy! < 0 || dx! >= grid[y]!.length || dy! >= grid.length)
          continue;

        if (grid[dy!]![dx!] === region.plant && !visited.has(`${dy},${dx}`)) {
          queue.push([dx!, dy!]);
        }
      }
    }

    return region;
  };

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y]!.length; x++) {
      if (visited.has(`${y},${x}`)) continue;

      const region = getRegion(x, y);
      regions.has(region.plant)
        ? regions.get(region.plant)!.push(region)
        : regions.set(region.plant, [region]);
    }
  }

  return regions;
};

console.time("part 1");
const regionPerimeters = getFencingRegionsPerimeter(grid);
console.timeEnd("part 1");

console.log(
  `part 1: ${Array.from(regionPerimeters.values()).reduce(
    (acc: number, region: RegionPerimeter[]) =>
      acc +
      region.reduce(
        (acc: number, region: RegionPerimeter) =>
          acc + region.perimeter * region.area,
        0
      ),
    0
  )}`
);

const getFencingRegionsSides = (
  grid: string[][]
): Map<string, RegionSide[]> => {
  const visited = new Set<string>();
  const regions = new Map<string, RegionSide[]>();

  const countConnectedSides = (borders: Set<string>): number => {
    const visitedSides = new Set<string>();

    const visitSide = (x: number, y: number, x2: number, y2: number) => {
      const sideKey = `${x},${y},${x2},${y2}`;
      if (visitedSides.has(sideKey) || !borders.has(sideKey)) return;

      visitedSides.add(sideKey);

      if (x === x2) {
        visitSide(x - 1, y, x2 - 1, y2);
        visitSide(x + 1, y, x2 + 1, y2);
      } else {
        visitSide(x, y - 1, x2, y2 - 1);
        visitSide(x, y + 1, x2, y2 + 1);
      }
    };

    let numSides = 0;
    borders.forEach((border) => {
      const [x, y, x2, y2] = border.split(",").map(Number);
      if (!visitedSides.has(border)) {
        numSides++;
        visitSide(x!, y!, x2!, y2!);
      }
    });

    return numSides;
  };

  const getRegion = (x: number, y: number): RegionSide => {
    const queue: [number, number][] = [];
    const region: RegionSide = {
      plant: grid[y]![x]!,
      area: 0,
      side: 0,
    };
    queue.push([x, y]);

    const borders = new Set<string>();

    while (queue.length > 0) {
      const [x, y] = queue.shift()!;
      if (visited.has(`${y},${x}`)) continue;
      region.area++;

      visited.add(`${y},${x}`);

      const directions = getDirections(x, y);

      for (const [dx, dy] of directions) {
        if (
          dx! < 0 ||
          dy! < 0 ||
          dx! >= grid[y]!.length ||
          dy! >= grid.length ||
          grid[dy!]![dx!] !== region.plant
        ) {
          borders.add(`${x},${y},${dx},${dy}`);
        }

        if (
          dx! >= 0 &&
          dy! >= 0 &&
          dx! < grid[y]!.length &&
          dy! < grid.length &&
          grid[dy!]![dx!] === region.plant &&
          !visited.has(`${dy},${dx}`)
        ) {
          queue.push([dx!, dy!]);
        }
      }
    }

    region.side = countConnectedSides(borders);

    return region;
  };

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y]!.length; x++) {
      if (visited.has(`${y},${x}`)) continue;

      const region = getRegion(x, y);
      regions.has(region.plant)
        ? regions.get(region.plant)!.push(region)
        : regions.set(region.plant, [region]);
    }
  }

  return regions;
};

console.time("part 2");
const regionsSides = getFencingRegionsSides(grid);
console.timeEnd("part 2");

console.log(
  `part 2: ${Array.from(regionsSides.values()).reduce(
    (acc: number, region: RegionSide[]) =>
      acc +
      region.reduce(
        (acc: number, region: RegionSide) => acc + region.side * region.area,
        0
      ),
    0
  )}`
);
