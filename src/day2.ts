import * as fs from "fs";
import * as path from "path";

const inputPath = path.join(__dirname, "../input/day2.txt");
const input = fs.readFileSync(inputPath, "utf8");

const reports = input
  .split("\n")
  .map((line) => line.split(" ").map((num) => parseInt(num) || 0));

let safeReports = 0;

const isSafeReport = (report: number[]) => {
  if (report.length === 0 || report.length === 1) {
    return false;
  }
  if (report[0]! === report[1]!) {
    return false;
  }

  let status: "up" | "down" = report[0]! < report[1]! ? "up" : "down";

  let lastDifference = Math.abs(report[0]! - report[1]!);
  if (lastDifference > 3) {
    return false;
  }

  for (let i = 1; i < report.length - 1; i++) {
    if (report[i]! < report[i + 1]!) {
      if (status === "down" || Math.abs(report[i]! - report[i + 1]!) > 3) {
        return false;
      }
      status = "up";
    }
    if (report[i]! > report[i + 1]!) {
      if (status === "up" || Math.abs(report[i]! - report[i + 1]!) > 3) {
        return false;
      }
      status = "down";
    }
    if (report[i]! === report[i + 1]!) {
      return false;
    }
  }
  return true;
};

for (const report of reports) {
  if (isSafeReport(report)) {
    safeReports++;
  }
}

console.log(`Part 1: ${safeReports}`);

safeReports = 0;

for (const report of reports) {
  if (isSafeReport(report)) {
    safeReports++;
  } else {
    for (let i = 0; i < report.length; i++) {
      let newReport = [...report.slice(0, i), ...report.slice(i + 1)];
      if (isSafeReport(newReport)) {
        safeReports++;
        break;
      }

      if (i > 0) {
        newReport = [...report.slice(0, i - 1), ...report.slice(i)];
        if (isSafeReport(newReport)) {
          safeReports++;
          break;
        }
      }

      if (i > 1) {
        newReport = [...report.slice(0, i - 2), ...report.slice(i - 1)];
        if (isSafeReport(newReport)) {
          safeReports++;
          break;
        }
      }
    }
  }
}

console.log(`Part 2: ${safeReports}`);
