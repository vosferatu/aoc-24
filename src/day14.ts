import * as fs from "fs";
import * as path from "path";

const inputPath = path.join(__dirname, "../input/day14.txt");
const input = fs.readFileSync(inputPath, "utf8");
const lines = input.split("\n");

type Robot = {
  position: {
    x: number;
    y: number;
  };
  velocity: {
    x: number;
    y: number;
  };
};

const robots: Robot[] = [];

lines.forEach((line) => {
  const [position, velocity] = line.split(" ");
  const [x, y] = position!.substring(2).split(",").map(Number);
  const [vx, vy] = velocity!.substring(2).split(",").map(Number);
  robots.push({
    position: { x: x!, y: y! },
    velocity: { x: vx!, y: vy! },
  });
});

const limits = {
  x: 101,
  y: 103,
};

const printGrid = (robots: Robot[]) => {
  const grid = Array.from({ length: limits.y }, () =>
    Array.from({ length: limits.x }, () => ".")
  );

  robots.forEach((robot) => {
    grid[robot.position.y]![robot.position.x] = "#";
  });

  console.log(grid.map((row) => row.join("")).join("\n"));
};

let seconds = 0;

do {
  seconds++;
  robots.forEach((robot) => {
    robot.position.x += robot.velocity.x;
    robot.position.y += robot.velocity.y;

    if (robot.position.x < 0) {
      robot.position.x += limits.x;
    }
    if (robot.position.x > limits.x - 1) {
      robot.position.x -= limits.x;
    }

    if (robot.position.y < 0) {
      robot.position.y += limits.y;
    }
    if (robot.position.y > limits.y - 1) {
      robot.position.y -= limits.y;
    }
  });
} while (seconds < 100);

const countQuadrants = (robots: Robot[]) => {
  const quadrants = {
    topLeft: 0,
    topRight: 0,
    bottomLeft: 0,
    bottomRight: 0,
  };

  robots.forEach((robot) => {
    if (
      robot.position.x < Math.floor(limits.x / 2) &&
      robot.position.y < Math.floor(limits.y / 2) &&
      robot.position.x >= 0 &&
      robot.position.y >= 0
    ) {
      quadrants.topLeft++;
    }
    if (
      robot.position.x < Math.floor(limits.x / 2) &&
      robot.position.y >= Math.ceil(limits.y / 2) &&
      robot.position.x >= 0 &&
      robot.position.y >= 0
    ) {
      quadrants.bottomLeft++;
    }
    if (
      robot.position.x >= Math.ceil(limits.x / 2) &&
      robot.position.y < Math.floor(limits.y / 2) &&
      robot.position.x >= 0 &&
      robot.position.y >= 0
    ) {
      quadrants.topRight++;
    }
    if (
      robot.position.x >= Math.ceil(limits.x / 2) &&
      robot.position.y >= Math.ceil(limits.y / 2) &&
      robot.position.x >= 0 &&
      robot.position.y >= 0
    ) {
      quadrants.bottomRight++;
    }
  });

  return quadrants;
};

console.time("part1");
console.log(
  `part1: ${Object.values(countQuadrants(robots)).reduce((a, b) => a * b, 1)}`
);
console.timeEnd("part1");

const checkForStraightLines = (robots: Robot[]) => {
  const minimumLineLength = 30;
  const map = new Map<string, number>();

  robots.forEach((robot) => {
    map.set(
      `x=${robot.position.x}`,
      (map.get(`x=${robot.position.x}`) ?? 0) + 1
    );
    map.set(
      `y=${robot.position.y}`,
      (map.get(`y=${robot.position.y}`) ?? 0) + 1
    );
  });

  const lines = Array.from(map.entries()).filter(
    ([_, count]) => count >= minimumLineLength
  );

  return lines.length >= 4;
};

const findTree = (): number => {
  let seconds = 0;
  do {
    seconds++;
    robots.forEach((robot) => {
      robot.position.x += robot.velocity.x;
      robot.position.y += robot.velocity.y;

      if (robot.position.x < 0) {
        robot.position.x += limits.x;
      }
      if (robot.position.x > limits.x - 1) {
        robot.position.x -= limits.x;
      }

      if (robot.position.y < 0) {
        robot.position.y += limits.y;
      }
      if (robot.position.y > limits.y - 1) {
        robot.position.y -= limits.y;
      }
    });
    if (checkForStraightLines(robots)) {
      return seconds;
    }
  } while (seconds < 10_000);

  return -1;
};

console.time("part2");
console.log(`part2: ${findTree()}`);
console.timeEnd("part2");
