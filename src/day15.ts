import * as fs from "fs";
import * as path from "path";

const inputPath = path.join(__dirname, "../input/day15.txt");
const input = fs.readFileSync(inputPath, "utf8");

const example = `#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^`;

const example2 = `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`;

const [originalMap, moves] = input.split("\n\n");
const mapArray = originalMap!.split("\n").map((line) => line.split(""));

const printMap = (map: string[][]) => {
  map.forEach((line) => {
    console.log(line.join(""));
  });
};

const movesArray = moves!.split("\n").flatMap((line) => line.split(""));

const directions: Record<string, { x: number; y: number }> = {
  "<": { x: -1, y: 0 },
  ">": { x: 1, y: 0 },
  "^": { x: 0, y: -1 },
  v: { x: 0, y: 1 },
};

const findInitialPosition = (map: string[][]) => {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y]!.length; x++) {
      if (map[y]![x] === "@") {
        return { x, y };
      }
    }
  }
};

const robotPosition = findInitialPosition(mapArray);

const moveRobot = (
  direction: { x: number; y: number },
  robotPosition: { x: number; y: number }
) => {
  const { x: dx, y: dy } = direction;
  const nextX = robotPosition.x + dx;
  const nextY = robotPosition.y + dy;
  const nextCell = mapArray[nextY]?.[nextX];

  if (nextCell === "#" || nextCell === undefined) {
    return;
  }

  if (nextCell === ".") {
    mapArray[robotPosition.y]![robotPosition.x] = ".";
    robotPosition.x = nextX;
    robotPosition.y = nextY;
    mapArray[robotPosition.y]![robotPosition.x] = "@";
    return;
  }

  if (nextCell === "O") {
    const boxPositions: { x: number; y: number }[] = [];
    let curX = nextX;
    let curY = nextY;

    while (mapArray[curY]?.[curX] === "O") {
      boxPositions.push({ x: curX, y: curY });
      curX += dx;
      curY += dy;
    }

    const cellAfterBoxes = mapArray[curY]?.[curX];

    if (cellAfterBoxes !== ".") {
      return;
    }

    mapArray[curY]![curX] = "O";

    for (let i = boxPositions.length - 1; i > 0; i--) {
      const nextBox = boxPositions[i];
      mapArray[nextBox!.y]![nextBox!.x] = "O";
    }

    mapArray[nextY]![nextX] = "@";
    mapArray[robotPosition.y]![robotPosition.x] = ".";

    robotPosition.x = nextX;
    robotPosition.y = nextY;
  }
};

for (let i = 0; i < movesArray.length; i++) {
  const move = movesArray[i];
  const direction = directions[move! as keyof typeof directions];

  moveRobot(direction!, robotPosition!);
}

printMap(mapArray);

console.log(
  `part1: ${mapArray.reduce(
    (acc, row, rowIndex) =>
      acc +
      row.reduce((sum, cell, cellIndex) => {
        if (cell === "O") {
          return sum + (100 * rowIndex + cellIndex);
        }
        return sum;
      }, 0),
    0
  )}`
);

const tmpMap = originalMap!.split("\n").map((line) => line.split(""));

const doubleMap: string[][] = new Array(tmpMap.length)
  .fill(".")
  .map(() => new Array(tmpMap[0]!.length * 2).fill("."));

for (let y = 0; y < tmpMap.length; y++) {
  for (let x = 0; x < tmpMap[y]!.length; x++) {
    if (tmpMap[y]![x] === "#") {
      doubleMap[y]![2 * x] = "#";
      doubleMap[y]![2 * x + 1] = "#";
    }
    if (tmpMap[y]![x] === "@") {
      doubleMap[y]![2 * x] = "@";
      doubleMap[y]![2 * x + 1] = ".";
    }
    if (tmpMap[y]![x] === ".") {
      doubleMap[y]![2 * x] = ".";
      doubleMap[y]![2 * x + 1] = ".";
    }
    if (tmpMap[y]![x] === "O") {
      doubleMap[y]![2 * x] = "[";
      doubleMap[y]![2 * x + 1] = "]";
    }
  }
}

const doubleRobotPosition = findInitialPosition(doubleMap);

const moveDoubleRobot = (
  map: string[][],
  direction: { x: number; y: number },
  robotPos: { x: number; y: number }
) => {
  const { x: dx, y: dy } = direction;

  const findBoxes: { x: number; y: number }[] = [
    { x: robotPos.x, y: robotPos.y },
  ];

  for (const box of findBoxes) {
    let boxX = box.x + dx;
    let boxY = box.y + dy;

    if (findBoxes.find((b) => b.x === boxX && b.y === boxY)) {
      continue;
    }

    if (map[boxY]?.[boxX] === "#") {
      return;
    }
    if (map[boxY]?.[boxX] === "[") {
      findBoxes.push({ x: boxX, y: boxY });
      findBoxes.push({ x: boxX + 1, y: boxY });
    }
    if (map[boxY]?.[boxX] === "]") {
      findBoxes.push({ x: boxX, y: boxY });
      findBoxes.push({ x: boxX - 1, y: boxY });
    }
  }

  findBoxes.splice(0, 1);
  const gridCopy = structuredClone(map);

  for (const box of findBoxes) {
    map[box.y]![box.x] = ".";
  }

  for (const box of findBoxes) {
    map[box.y + dy]![box.x + dx] = gridCopy[box.y]![box.x]!;
  }

  map[robotPos.y]![robotPos.x] = ".";
  robotPos.x += dx;
  robotPos.y += dy;
  map[robotPos.y]![robotPos.x] = "@";
};

for (let i = 0; i < movesArray.length; i++) {
  const move = movesArray[i];
  const direction = directions[move! as keyof typeof directions];

  moveDoubleRobot(doubleMap, direction!, doubleRobotPosition!);
}

console.log(
  `part2: ${doubleMap.reduce(
    (acc, row, rowIndex) =>
      acc +
      row.reduce((sum, cell, cellIndex) => {
        if (cell === "[") {
          return sum + (100 * rowIndex + cellIndex);
        }
        return sum;
      }, 0),
    0
  )}`
);
