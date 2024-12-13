import * as fs from "fs";
import * as path from "path";

const inputPath = path.join(__dirname, "../input/day13.txt");
const input = fs.readFileSync(inputPath, "utf8");

const costs = {
  A: 3,
  B: 1,
};

type Coordinates = {
  x: number;
  y: number;
};

type ArcadeGame = {
  buttonA: Coordinates;
  buttonB: Coordinates;
  prize: Coordinates;
};

const arcadeGames: ArcadeGame[] = [];

input.split("\n\n").forEach((line) => {
  let [buttonALine, buttonBLine, prizeLine] = line.split("\n");

  if (!buttonALine || !buttonBLine || !prizeLine) {
    return;
  }
  buttonALine = buttonALine.split(": ")[1]!;
  buttonBLine = buttonBLine.split(": ")[1]!;
  prizeLine = prizeLine.split(": ")[1]!;

  const buttonA = {
    x: parseInt(
      buttonALine.substring(
        buttonALine.indexOf("X") + 2,
        buttonALine.indexOf(",")
      )
    ),
    y: parseInt(buttonALine.substring(buttonALine.indexOf("Y") + 2)),
  };
  const buttonB = {
    x: parseInt(
      buttonBLine.substring(
        buttonBLine.indexOf("X") + 2,
        buttonBLine.indexOf(",")
      )
    ),
    y: parseInt(buttonBLine.substring(buttonBLine.indexOf("Y") + 2)),
  };
  const prize = {
    x: parseInt(
      prizeLine.substring(prizeLine.indexOf("X") + 2, prizeLine.indexOf(","))
    ),
    y: parseInt(prizeLine.substring(prizeLine.indexOf("Y") + 2)),
  };

  const arcadeGame: ArcadeGame = {
    buttonA,
    buttonB,
    prize,
  };

  arcadeGames.push(arcadeGame);
});

function calculateTokens(game: ArcadeGame): number {
  const buttonAx = game.buttonA.x;
  const buttonAy = game.buttonA.y;
  const buttonBx = game.buttonB.x;
  const buttonBy = game.buttonB.y;
  const prizeX = game.prize.x;
  const prizeY = game.prize.y;

  const determinant = buttonAx * buttonBy - buttonAy * buttonBx;
  const [pressesA, pressesB] = [
    (prizeX * buttonBy - prizeY * buttonBx) / determinant,
    (buttonAx * prizeY - buttonAy * prizeX) / determinant,
  ];

  if (
    Number.isInteger(pressesA) &&
    Number.isInteger(pressesB) &&
    pressesA >= 0 &&
    pressesB >= 0
  ) {
    return pressesA * costs.A + pressesB * costs.B;
  }
  return 0;
}

function solve(games: ArcadeGame[], offset: number = 0): number {
  return games
    .map((game) => ({
      ...game,
      prize: {
        x: game.prize.x + offset,
        y: game.prize.y + offset,
      },
    }))
    .reduce((total, game) => total + calculateTokens(game), 0);
}

console.time("part 1");
console.log(`part 1: ${solve(arcadeGames)}`);
console.timeEnd("part 1");

console.time("part 2");
console.log(`part 2: ${solve(arcadeGames, Math.pow(10, 13))}`);
console.timeEnd("part 2");
