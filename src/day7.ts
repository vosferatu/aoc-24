import * as fs from "fs";
import * as path from "path";

const inputPath = path.join(__dirname, "../input/day7.txt");
const input = fs.readFileSync(inputPath, "utf8");

type Equation = {
  result: number;
  operands: number[];
};

const equations: Equation[] = [];

for (const line of input.split("\n")) {
  const [left, right] = line.split(":");
  const rightParts = right!.split(" ");

  equations.push({
    result: parseInt(left!),
    operands: rightParts.slice(1).map((part) => parseInt(part)),
  });
}

const isEquationPossible = (result: bigint, equation: bigint[]): boolean => {
  const dfs = (index: number, currentValue: bigint): boolean => {
    if (index === equation.length) {
      return currentValue === result;
    }

    if (dfs(index + 1, currentValue + equation[index]!)) {
      return true;
    }

    if (dfs(index + 1, currentValue * equation[index]!)) {
      return true;
    }

    return false;
  };

  return dfs(0, 0n);
};

console.time("part 1");

let total = 0n;
for (const equation of equations) {
  if (
    isEquationPossible(BigInt(equation.result), equation.operands.map(BigInt))
  ) {
    total += BigInt(equation.result);
  }
}
console.timeEnd("part 1");
console.log(`part 1: ${total}`);

const isEquationPossiblePart2 = (
  result: bigint,
  equation: bigint[]
): boolean => {
  const dfs = (index: number, currentValue: bigint): boolean => {
    if (index === equation.length) {
      return currentValue === result;
    }

    if (dfs(index + 1, currentValue + equation[index]!)) {
      return true;
    }

    if (dfs(index + 1, currentValue * equation[index]!)) {
      return true;
    }

    if (
      dfs(
        index + 1,
        BigInt(Number(String(currentValue) + String(equation[index]!)))
      )
    ) {
      return true;
    }

    return false;
  };

  return dfs(0, 0n);
};

console.time("part 2");

total = 0n;
for (const equation of equations) {
  if (
    isEquationPossiblePart2(
      BigInt(equation.result),
      equation.operands.map(BigInt)
    )
  ) {
    total += BigInt(equation.result);
  }
}

console.timeEnd("part 2");
console.log(`part 2: ${total}`);
