const input = {
  lines: [""],
  cursorAt: { line: 0, column: 0 },
};

const copy = (obj) => JSON.parse(JSON.stringify(obj));

const history = [copy(input)];

const setInput = (newInput) => {
  const _newInput = copy(newInput);
  history.push(_newInput);

  input.lines = newInput.lines;
  input.cursorAt = newInput.cursorAt;
};

const addInput = (newText) => {
  // adds newInput (e.g. "a") to the current input, taking into account
  // the current cursor position

  const newInput = { ...input };
  const currentLine = input.cursorAt.line;
  const currentCol = input.cursorAt.column;

  // TODO handle possibility of text being pasted - i.e. new lines are entered
  // within a single string so the content needs to be parsed

  let newLine, newCol;
  if (newText === "\n") {
    // newInput.lines[currentLine] = newInput.lines[currentLine] + "⏎"; // debug
    newInput.lines.push("");
    newCol = 0;
    newLine = currentLine + 1;
  } else {
    // newCol = currentCol + newText.length - 1;
    // we're adding the full length of newText because when you're typing
    // something, usually the cursor is past the last character
    newCol = currentCol + newText.length;
    newLine = currentLine;
    newInput.lines[newLine] = newInput.lines[newLine] + newText;
  }
  newInput.cursorAt.line = newLine;
  newInput.cursorAt.column = newCol;

  setInput(newInput);
};

const backspace = () => {
  //
};

const cursorToLeft = (times = 1) => {
  const toLeft = () => {
    const currPos = input.cursorAt;
    const newPos = input.cursorAt;
    if (currPos.column > 0) {
      newPos.column -= 1;
    } else if (currPos.column == 0 && currPos.line > 0) {
      newPos.line -= 1;
      newPos.column = input.lines[newPos.line].length;
    }
    input.cursorAt = newPos;
  };

  for (let i = 0; i < times; i++) toLeft();
};

const cursorToRight = () => {
  const currPos = input.cursorAt;
  const newPos = input.cursorAt;
  const currLineLength = input.lines[currPos.line].length - 1;
  if (currPos.column < currLineLength) {
    newPos.column += 1;
  } else if (
    currPos.column == currLineLength &&
    currPos.line < input.lines.length
  ) {
    newPos.column = 0;
    newPos.line += 1;
  }
  input.cursorAt = newPos;
};

const highlightedChar = () =>
  input.lines[input.cursorAt.line][input.cursorAt.column];

const printHistory = (history) => {
  for (let i = 0; i < history.length; i++) {
    const lines = history[i].lines.reduce((acc, v) => `${acc}, ${v}`);
    console.log(`> entry #${i}`);
    console.log("lines: ", lines);
    console.log(
      `cursor: line=${history[i].cursorAt.line} col=${history[i].cursorAt.column}\n`
    );
  }
};

const render = (input) => {
  // highlight cursor
  for (let i = 0; i < input.lines.length; i++) {
    for (let j = 0; j < input.lines[i].length; j++) {
      if (input.cursorAt.line == i && input.cursorAt.column == j) {
        input.lines[i] =
          input.lines[i].substring(0, j) +
          "\x1b[33m" +
          input.lines[i][j] +
          "\x1b[0m" +
          input.lines[i].substring(j + 1, input.lines[i].length);
      }
    }
  }

  for (const line of input.lines) {
    console.log(line);
  }
  console.log();
};

const printCursorPos = (input) => {
  console.log(
    `cursor: line=${input.cursorAt.line},
     column=${input.cursorAt.column},
     char='${highlightedChar()}'\n`.replace(/\n[ ]+/g, " ")
  );
};

addInput("ola");
addInput("\n");
addInput("\n");
addInput("adeus");

// render(history[history.length - 1]);

// printHistory(history);

printCursorPos(input);
cursorToLeft(5);
cursorToRight(1);
// printCursorPos(input);

render(input);
