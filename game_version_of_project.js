const prompt = require("prompt-sync")();
const fs = require("fs");

const ROWS = 3;
const COLS = 3;
const colors = [
  "\x1b[31m",
  "\x1b[32m",
  "\x1b[33m",
  "\x1b[34m",
  "\x1b[35m",
  "\x1b[36m",
];
const resetColor = "\x1b[0m";

// Car data by class
const CARS = {
  S: [{ name: "Koenigsegg Jesko", hp: 1280, speed: 482, accel: 2.5 }],
  A: [{ name: "McLaren 720S", hp: 710, speed: 341, accel: 2.8 }],
  B: [{ name: "BMW M4", hp: 503, speed: 280, accel: 3.9 }],
  C: [{ name: "Mazda MX-5", hp: 181, speed: 215, accel: 5.7 }],
  D: [{ name: "Suzuki Swift", hp: 90, speed: 180, accel: 10.2 }],
};

let garage = [];

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const clearConsole = () => process.stdout.write("\x1Bc");

const randomSymbol = () => {
  const keys = Object.keys(CARS);
  return keys[Math.floor(Math.random() * keys.length)];
};

const generateFakeRows = () => {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    const row = [];
    for (let j = 0; j < COLS; j++) {
      row.push(randomSymbol());
    }
    rows.push(row);
  }
  return rows;
};

const printRows = (rows) => {
  const cellWidth = 5;
  const totalWidth = (cellWidth + 1) * rows[0].length - 1;

  console.log("\n╔" + "═".repeat(totalWidth) + "╗");
  for (let i = 0; i < rows.length; i++) {
    let rowStr = "║";
    for (let j = 0; j < rows[i].length; j++) {
      const symbol = rows[i][j];
      const color = colors[j % colors.length];
      const content =
        color + symbol.padStart(2, " ").padEnd(cellWidth, " ") + resetColor;
      rowStr += content;
      if (j !== rows[i].length - 1) rowStr += "│";
    }
    rowStr += "║";
    console.log(rowStr);
    if (i !== rows.length - 1) console.log("╟" + "─".repeat(totalWidth) + "╢");
  }
  console.log("╚" + "═".repeat(totalWidth) + "╝\n");
};

const checkWinnings = (rows) => {
  for (let row of rows) {
    if (row.every((sym) => sym === row[0])) return row[0];
  }
  return null;
};

const unlockCar = (tier) => {
  const cars = CARS[tier];
  const car = cars[Math.floor(Math.random() * cars.length)];
  garage.push(car);
  console.log(`\n🚗 You unlocked a ${tier}-class car: ${car.name}!`);
  console.log(
    `   ➔ HP: ${car.hp}hp | Top Speed: ${car.speed}km/h | 0-100km/h: ${car.accel}s\n`
  );
};

const askMathProblem = () => {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  const operations = ["+", "-", "*"];
  const op = operations[Math.floor(Math.random() * operations.length)];
  const problem = `${a} ${op} ${b}`;
  const answer = eval(problem);
  const userAnswer = parseInt(prompt(`Solve to spin again: ${problem} = `));
  return userAnswer === answer;
};

const viewGarage = () => {
  if (garage.length === 0) {
    console.log("\n🛻 Your garage is empty!\n");
  } else {
    console.log("\n🚗 Your Garage:");
    garage.forEach((car, idx) => {
      console.log(
        `${idx + 1}. ${car.name} | HP: ${car.hp} | Top Speed: ${
          car.speed
        }km/h | 0-100: ${car.accel}s`
      );
    });
    console.log("");
  }
};

const mainMenu = async () => {
  while (true) {
    console.log("\n=== Car Slot Machine ===");
    console.log("1. Spin the wheel");
    console.log("2. View Garage");
    console.log("3. Exit");

    const choice = prompt("Select an option: ");

    if (choice === "1") {
      clearConsole();
      console.log("\nSpinning...");
      for (let i = 0; i < 8; i++) {
        const fakeRows = generateFakeRows();
        clearConsole();
        printRows(fakeRows);
        await sleep(100 + i * 30);
      }

      const finalRows = generateFakeRows();
      clearConsole();
      printRows(finalRows);

      const winningSymbol = checkWinnings(finalRows);

      if (winningSymbol) {
        console.log(
          `\n🎉 Row match! Unlocking a ${winningSymbol}-class car...`
        );
        unlockCar(winningSymbol);
      } else {
        console.log("\nNo matches! Better luck next time.\n");
      }

      if (!askMathProblem()) {
        console.log("Wrong answer. Exiting spin.");
      }
    } else if (choice === "2") {
      viewGarage();
    } else if (choice === "3") {
      console.log("\nThanks for playing!");
      break;
    } else {
      console.log("\nInvalid choice.");
    }
  }
};

// Start the game
clearConsole();
mainMenu();
