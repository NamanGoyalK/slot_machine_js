// 1. Deposit some money
// 2. Determine the number of lines to bet on
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. Check if the user won
// 6. Give the user their winnings
// 7. Play again

const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOL_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOL_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

const deposit = () => {
  while (true) {
    const depositAmount = prompt("Enter a deposit amount: ");
    const numberDepositAmount = parseFloat(depositAmount);

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log("Invalid deposit amount, try again.");
    } else {
      return numberDepositAmount;
    }
  }
};

const getNumberOfLines = () => {
  while (true) {
    const lines = prompt("Enter the number of lines to bet on (1-3): ");
    const numberOfLines = parseFloat(lines);

    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
      console.log("Invalid number of lines, try again.");
    } else {
      return numberOfLines;
    }
  }
};

const getBet = (balance, numberOfLines) => {
  while (true) {
    const bet = prompt("Enter the bet per line: ");
    const numberBet = parseFloat(bet);

    if (
      isNaN(numberBet) ||
      numberBet <= 0 ||
      numberBet > balance / numberOfLines
    ) {
      console.log("Invalid bet, try again.");
    } else {
      return numberBet;
    }
  }
};

const Spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOL_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const colors = ["\x1b[31m", "\x1b[32m", "\x1b[33m", "\x1b[35m"];
const resetColor = "\x1b[0m";

const clearConsole = () => process.stdout.write("\x1Bc");

const printRows = (rows) => {
  const cellWidth = 5; // Enough width for symbol + padding
  const totalWidth = (cellWidth + 1) * rows[0].length - 1;

  const topBorder = "╔" + "═".repeat(totalWidth) + "╗";
  const bottomBorder = "╚" + "═".repeat(totalWidth) + "╝";
  const separator = "╟" + "─".repeat(totalWidth) + "╢";

  console.log(topBorder);
  for (let i = 0; i < rows.length; i++) {
    let rowStr = "║";
    for (let j = 0; j < rows[i].length; j++) {
      const symbol = rows[i][j];
      const color = colors[j % colors.length];
      const content =
        color +
        symbol.toString().padStart(2, " ").padEnd(cellWidth, " ") +
        resetColor;
      rowStr += content;
      if (j !== rows[i].length - 1) rowStr += "│";
    }
    rowStr += "║";
    console.log(rowStr);
    if (i !== rows.length - 1) console.log(separator);
  }
  console.log(bottomBorder);
};

const randomSymbol = () => {
  const symbols = Object.keys(SYMBOL_COUNT);
  return symbols[Math.floor(Math.random() * symbols.length)];
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

const spinAndPrintRows = async (finalRows, winnings = 0) => {
  const spins = 10;
  for (let i = 0; i < spins; i++) {
    clearConsole();
    const fakeRows = generateFakeRows();
    printRows(fakeRows);
    await sleep(80 + i * 30);
  }
  clearConsole();
  printRows(finalRows);
  if (winnings > 0) {
    console.log(`\n🎉 You won ₹${winnings}! 🎉\n`);
  } else {
    console.log("\nBetter luck next spin!\n");
  }
};

const checkWinnings = (rows, bet, lines) => {
  let winnings = 0;

  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    const firstSymbol = symbols[0];
    let allSame = symbols.every((symbol) => symbol === firstSymbol);

    if (allSame) {
      winnings += bet * SYMBOL_VALUES[firstSymbol];
    }
  }

  return winnings;
};

(async () => {
  let balance = deposit();

  while (true) {
    console.log("Your current balance is: ₹" + balance);
    const numberOfLines = getNumberOfLines();
    const bet = getBet(balance, numberOfLines);
    const totalBet = bet * numberOfLines;
    balance -= totalBet;
    console.log(
      `You are betting ₹${bet} on ${numberOfLines} lines. Total bet: ₹${totalBet}`
    );

    const reels = Spin();
    const rows = transpose(reels);
    await spinAndPrintRows(rows);

    const winnings = checkWinnings(rows, bet, numberOfLines);
    balance += winnings;
    await spinAndPrintRows(rows, winnings);

    if (balance <= 0) {
      console.log("You ran out of money!");
      break;
    }

    const playAgain = prompt("Do you want to play again? (y/n) ");
    if (playAgain.toLowerCase() !== "y") break;
  }

  console.log("Thanks for playing! Final balance: ₹" + balance);
})();
