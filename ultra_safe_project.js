const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;
const garage = [];

const SYMBOL_COUNT = { S: 2, A: 4, B: 6, C: 8, D: 10 };

const CAR_DATABASE = {
  S: [
    {
      name: "Bugatti Chiron",
      engine: "8.0L W16",
      hp: 1500,
      zeroToHundred: 2.4,
      price: "₹19 Cr",
    },
    {
      name: "Koenigsegg Jesko",
      engine: "5.0L V8",
      hp: 1600,
      zeroToHundred: 2.5,
      price: "₹24 Cr",
    },
    {
      name: "Lamborghini Veneno",
      engine: "6.5L V12",
      hp: 750,
      zeroToHundred: 2.8,
      price: "₹30 Cr",
    },
  ],
  A: [
    {
      name: "Ferrari 488",
      engine: "3.9L V8",
      hp: 661,
      zeroToHundred: 3.0,
      price: "₹4 Cr",
    },
    {
      name: "McLaren 720S",
      engine: "4.0L V8",
      hp: 710,
      zeroToHundred: 2.9,
      price: "₹4.65 Cr",
    },
    {
      name: "Porsche 911 Turbo S",
      engine: "3.8L Flat-6",
      hp: 640,
      zeroToHundred: 2.7,
      price: "₹3.5 Cr",
    },
  ],
  B: [
    {
      name: "BMW M4",
      engine: "3.0L I6",
      hp: 503,
      zeroToHundred: 3.8,
      price: "₹1.5 Cr",
    },
    {
      name: "Audi RS5",
      engine: "2.9L V6",
      hp: 444,
      zeroToHundred: 3.9,
      price: "₹1.3 Cr",
    },
    {
      name: "Mercedes C63 AMG",
      engine: "4.0L V8",
      hp: 469,
      zeroToHundred: 4.0,
      price: "₹1.6 Cr",
    },
  ],
  C: [
    {
      name: "VW Golf GTI",
      engine: "2.0L I4",
      hp: 241,
      zeroToHundred: 5.9,
      price: "₹40L",
    },
    {
      name: "Ford Mustang EcoBoost",
      engine: "2.3L I4",
      hp: 310,
      zeroToHundred: 5.3,
      price: "₹80L",
    },
    {
      name: "Mazda MX-5",
      engine: "2.0L I4",
      hp: 181,
      zeroToHundred: 6.1,
      price: "₹35L",
    },
  ],
  D: [
    {
      name: "Suzuki Swift",
      engine: "1.2L I4",
      hp: 89,
      zeroToHundred: 12.5,
      price: "₹8L",
    },
    {
      name: "Hyundai i20",
      engine: "1.0L Turbo",
      hp: 120,
      zeroToHundred: 11.2,
      price: "₹10L",
    },
    {
      name: "Honda Civic",
      engine: "1.5L Turbo I4",
      hp: 174,
      zeroToHundred: 8.2,
      price: "₹20L",
    },
  ],
};

const rarityTags = {
  S: "🔥 Legendary",
  A: "🥇 Epic",
  B: "🏅 Rare",
  C: "🎖️ Uncommon",
  D: "📦 Common",
};
const colors = ["\x1b[31m", "\x1b[32m", "\x1b[33m", "\x1b[35m"];
const resetColor = "\x1b[0m";
const red = "\x1b[31m",
  yellow = "\x1b[33m",
  green = "\x1b[32m",
  blue = "\x1b[34m",
  cyan = "\x1b[36m";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const clearConsole = () => process.stdout.write("\x1Bc");

const Spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOL_COUNT)) {
    for (let i = 0; i < count; i++) symbols.push(symbol);
  }
  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }
  return reels;
};

const transpose = (reels) => {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
};

const randomSymbol = () => {
  const symbols = Object.keys(SYMBOL_COUNT);
  return symbols[Math.floor(Math.random() * symbols.length)];
};

const generateFakeRows = () => {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    const row = [];
    for (let j = 0; j < COLS; j++) row.push(randomSymbol());
    rows.push(row);
  }
  return rows;
};

const printRows = (rows) => {
  const cellWidth = 5;
  const totalWidth = (cellWidth + 1) * rows[0].length - 1;

  console.log("╔" + "═".repeat(totalWidth) + "╗");
  for (let i = 0; i < rows.length; i++) {
    let rowStr = "║";
    for (let j = 0; j < rows[i].length; j++) {
      const symbol = rows[i][j];
      const color = colors[j % colors.length];
      rowStr +=
        color + symbol.padStart(2, " ").padEnd(cellWidth, " ") + resetColor;
      if (j !== rows[i].length - 1) rowStr += "│";
    }
    rowStr += "║";
    console.log(rowStr);
    if (i !== rows.length - 1) console.log("╟" + "─".repeat(totalWidth) + "╢");
  }
  console.log("╚" + "═".repeat(totalWidth) + "╝");
};

const spinAndPrintRows = async (finalRows) => {
  const spins = 10;
  for (let i = 0; i < spins; i++) {
    clearConsole();
    printRows(generateFakeRows());
    await sleep(80 + i * 30);
  }
  clearConsole();
  printRows(finalRows);
};

const checkWinningRows = (rows) => {
  const winningClasses = [];
  for (let row = 0; row < ROWS; row++) {
    const firstSymbol = rows[row][0];
    if (rows[row].every((symbol) => symbol === firstSymbol)) {
      winningClasses.push(firstSymbol);
    }
  }
  return winningClasses;
};

const displayCarStats = (car, carClass) => {
  const classColor =
    carClass === "S"
      ? red
      : carClass === "A"
      ? yellow
      : carClass === "B"
      ? green
      : carClass === "C"
      ? cyan
      : blue;
  console.log(
    `${classColor}\n🚗 Car Unlocked: ${car.name} (${rarityTags[carClass]})`
  );
  console.log(`🏎️  Engine: ${car.engine}`);
  console.log(`💥 Horsepower: ${car.hp} HP`);
  console.log(`⚡  0–100 km/h: ${car.zeroToHundred} sec`);
  console.log(`💰 Price: ${car.price}${resetColor}\n`);
};

const askMathChallenge = () => {
  const a = Math.floor(Math.random() * 20) + 1;
  const b = Math.floor(Math.random() * 20) + 1;
  const answer = a + b;
  const userAnswer = parseInt(prompt(`Solve: ${a} + ${b} = `));
  return userAnswer === answer;
};

const showGarage = () => {
  console.log(`${cyan}\n🚗 Your Garage Collection:`);
  if (garage.length === 0) {
    console.log("No cars unlocked yet.");
  } else {
    garage.forEach((car) =>
      console.log(`- ${car.name} (${rarityTags[car.class]})`)
    );
  }
  console.log(resetColor);
};

(async () => {
  console.log(
    `${cyan}🚗 Welcome to the Car Unlocker Machine 2.0 🚗${resetColor}`
  );

  while (true) {
    const reels = Spin();
    const rows = transpose(reels);

    await spinAndPrintRows(rows);

    const winningClasses = checkWinningRows(rows);

    if (winningClasses.length > 0) {
      console.log("\n🏆 You unlocked:");

      for (const carClass of winningClasses) {
        const carList = CAR_DATABASE[carClass];
        const car = carList[Math.floor(Math.random() * carList.length)];

        if (!garage.some((c) => c.name === car.name)) {
          garage.push({ ...car, class: carClass });
        }

        await sleep(500);
        displayCarStats(car, carClass);
      }
    } else {
      console.log("\n😢 No car unlocked! Try again.");
    }

    const action = prompt(
      "\nType 'spin' to spin again, 'garage' to view collection, 'exit' to quit: "
    ).toLowerCase();
    if (action === "exit") break;
    if (action === "garage") {
      showGarage();
      continue;
    }
    if (action === "spin") {
      if (!askMathChallenge()) {
        console.log(`${red}❌ Wrong answer! Try again next time.${resetColor}`);
        break;
      }
    }
  }

  console.log("\nThanks for playing! 🚗");
})();
