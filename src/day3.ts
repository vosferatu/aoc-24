import * as fs from "fs";
import * as path from "path";

const inputPath = path.join(__dirname, "../input/day3.txt");
const input = fs.readFileSync(inputPath, "utf8");

const mulRegex = /mul\((\d{1,3}),(\d{1,3})\)/g;

const mulMatches = input.match(mulRegex);

const mulTotal = mulMatches?.reduce((acc, match) => {
  const [_, a, b] = match.match(/mul\((\d{1,3}),(\d{1,3})\)/)!;
  return acc + parseInt(a!) * parseInt(b!);
}, 0);

console.log(`part 1: ${mulTotal}`);

const operationRegex = /(?:mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\))/g;

const doDontMulMatches = input.match(operationRegex);

let operationEnabled = true;
let total = 0;

for (const match of doDontMulMatches!) {
  if (match === "do()") {
    operationEnabled = true;
  } else if (match === "don't()") {
    operationEnabled = false;
  } else {
    const [_, a, b] = match.match(/mul\((\d{1,3}),(\d{1,3})\)/)!;
    if (operationEnabled) {
      total += parseInt(a!) * parseInt(b!);
    }
  }
}

console.log(`part 2: ${total}`);
