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
    newInput.lines.push("");
    newCol = 0;
    newLine = currentLine + 1;
  } else {
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
  const newInput = copy(input);
  const currentLine = input.cursorAt.line;
  const currentCol = input.cursorAt.column;

  if (currentLine > 0 && currentCol === 0) {
    // current position is at the start of a line...
    // 1. get contents of current line
    // 2. place them on previous line
    const currentLineContents = input.lines[currentLine];
  } else if (currentCol > 0) {
    // current position is somewhere else, just delete the character
    //
  }

  // cannot delete
};

const cursorToLeft = () => {
  const currPos = input.cursorAt;
  const newPos = input.cursorAt;

  if (currPos.column > 0) {
    // we can go left because we're not at the very start of a line
    newPos.column -= 1;
  } else if (currPos.column === 0 && currPos.line > 0) {
    // we're at the start of a line, can we go to a previous line? if so, go
    newPos.line -= 1;
    newPos.column = input.lines[newPos.line].length;
  }

  input.cursorAt = newPos;
};

const cursorToRight = () => {
  const currPos = input.cursorAt;
  const newPos = input.cursorAt;
  const currLine = input.lines[currPos.line];
  // const currLineLength = currLine.length > 0 ? currLine.length - 1 : 0;
  const currLineLength = currLine.length - 1;

  if (currPos.column < currLineLength) {
    // we can go right because we're not at the end of the line
    newPos.column += 1;
  } else if (currPos.column === currLineLength) {
    // we're at the end of a line, go to end of line (which is not a char)
    newPos.column += 1;
  } else if (
    currPos.column > currLineLength &&
    currPos.line < input.lines.length - 1
  ) {
    // we're past the end of the line, go to next line if possible
    newPos.column = 0;
    newPos.line += 1;
  } else {
    // do nothing
  }

  input.cursorAt = newPos;
};

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

const YELLOW = "\x1b[33m";
const BOLD = "\x1b[1m";
const UNDERLINE = "\x1b[4m";
const RESET = "\x1b[0m";

const render = (input) => {
  const contents = copy(input);
  const line = contents.cursorAt.line;
  const column = contents.cursorAt.column;

  const char = contents.lines[line][column];
  if (char === " ") {
    contents.lines[line] =
      contents.lines[line].substring(0, column) +
      YELLOW +
      "_" +
      RESET +
      contents.lines[line].substring(column + 1, contents.lines[line].length);
  } else {
    contents.lines[line] = contents.lines[line][column]
      ? contents.lines[line].substring(0, column) +
        YELLOW +
        contents.lines[line][column] +
        RESET +
        contents.lines[line].substring(column + 1, contents.lines[line].length)
      : contents.lines[line].substring(0, column) +
        YELLOW +
        "⏎" +
        RESET +
        contents.lines[line].substring(column + 1, contents.lines[line].length);
  }

  for (const line of contents.lines) {
    console.log(line);
  }

  console.log(); // new line
};

const highlightedChar = () =>
  input.lines[input.cursorAt.line][input.cursorAt.column];

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
addInput("e adeus");
addInput("\n");
addInput("xau");

// render(history[history.length - 1]);
// printHistory(history);

render(input);

process.stdin.setRawMode(true);
process.stdin.setEncoding("utf8");
process.stdin.resume();

process.stdin.on("data", function (key) {
  // https://en.wikipedia.org/wiki/ANSI_escape_code#Terminal_input_sequences
  // console.log(toUnicode(key));

  if (key === "\u0003") {
    // ctrl-c
    process.stdout.write("bye");
    process.exit();
  }

  if (key === "\u001B\u005B\u0041") {
    // up
  } else if (key === "\u001B\u005B\u0042") {
    // down
  } else if (key === "\u001B\u005B\u0043") {
    cursorToRight(1);
  } else if (key === "\u001B\u005B\u0044") {
    cursorToLeft(1);
  } else if (key === "\u000D") {
    addInput("\n");
  } else {
    addInput(key);
  }

  // console.clear();
  render(input);
});

const toUnicode = (str) => {
  let unicode = "";
  for (let i = 0; i < str.length; i++) {
    let theUnicode = str.charCodeAt(i).toString(16).toUpperCase();
    while (theUnicode.length < 4) {
      theUnicode = "0" + theUnicode;
    }
    theUnicode = "\\u" + theUnicode;
    unicode += theUnicode;
  }
  return unicode;
};
