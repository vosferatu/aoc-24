import * as fs from "fs";
import * as path from "path";

const inputPath = path.join(__dirname, "../input/day9.txt");
const input = fs.readFileSync(inputPath, "utf8");

let fileExpanded: (string | number)[] = [];
let id = 0;
for (let i = 0; i < input.length; i++) {
  const char = input[i];
  if (i % 2 === 0) {
    for (let j = 0; j < Number(char); j++) {
      fileExpanded.push(id);
    }
    id++;
  } else {
    for (let j = 0; j < Number(char); j++) {
      fileExpanded.push(".");
    }
  }
}

const fileExpandedCopy = structuredClone(fileExpanded);

console.time("part 1");
let total = 0;
for (let i = 0; i < fileExpanded.length; i++) {
  if (fileExpanded[i] === ".") {
    for (let j = fileExpanded.length - 1; j > i; j--) {
      if (fileExpanded[j] !== ".") {
        fileExpanded[i] = fileExpanded[j]!;
        fileExpanded[j] = ".";
        break;
      }
    }
  }
}

for (let i = 0; i < fileExpanded.length; i++) {
  if (fileExpanded[i] !== ".") {
    total += Number(fileExpanded[i]) * i;
  }
}

console.timeEnd("part 1");
console.log(`part 1: ${total}`);

console.time("part 2");
for (let i = fileExpandedCopy.length - 1; i >= 0; i--) {
  let firstFreeIndex = 0;
  if (fileExpandedCopy[i] !== ".") {
    let currentId = fileExpandedCopy[i];
    let fileSize = 0;

    for (let j = i; j >= 0; j--) {
      if (fileExpandedCopy[j] === currentId) {
        fileSize += 1;
        i = j;
      } else {
        break;
      }
    }

    for (let j = firstFreeIndex; j < fileExpandedCopy.length; j++) {
      if (fileExpandedCopy[j] === ".") {
        firstFreeIndex = j;
        let freeSpace = 0;
        for (let k = j; k < fileExpandedCopy.length; k++) {
          if (fileExpandedCopy[k] === "." && k < i) {
            freeSpace += 1;
          } else {
            break;
          }
        }

        if (freeSpace >= fileSize) {
          fileExpandedCopy.splice(
            firstFreeIndex,
            fileSize,
            ...(new Array(fileSize).fill(currentId) as (string | number)[])
          );
          fileExpandedCopy.splice(
            i,
            fileSize,
            ...(new Array(fileSize).fill(".") as (string | number)[])
          );
          firstFreeIndex += fileSize;
          break;
        }
      }
    }
  }
}

total = 0;
for (let i = 0; i < fileExpandedCopy.length; i++) {
  if (fileExpandedCopy[i] !== ".") {
    total += Number(fileExpandedCopy[i]) * i;
  }
}

console.timeEnd("part 2");
console.log(`part 2: ${total}`);
