const input = {
  text: "",
  cursor: 0,
};

const addInput = (newText) => {
  // input.text += newText;
  // input.cursor += newText.length;

  const first = input.text.slice(0, input.cursor);
  const second = input.text.slice(input.cursor + 1, input.text.length);
  const middle =
    newText + (input.text[input.cursor] ? input.text[input.cursor] : "");

  input.text = first + middle + second;
  input.cursor = input.cursor + newText.length;
};

const backspace = () => {
  if (input.cursor === 0) {
    return;
  }

  input.text =
    input.text.slice(0, input.cursor - 1) +
    input.text.slice(input.cursor, input.text.length);
  input.cursor = input.cursor - 1;
};

const cursorToLeft = () => {
  if (input.cursor > 0) {
    input.cursor -= 1;
  }
};

const cursorToRight = () => {
  if (input.cursor < input.text.length) {
    input.cursor += 1;
  }
};

const HIGHLIGHT = "\x1b[4m";
const RESET = "\x1b[0m";

const render = () => {
  const first = input.text.slice(0, input.cursor);
  const second = input.text.slice(input.cursor + 1, input.text.length);
  let middle = input.text[input.cursor];

  if (!middle) {
    middle = "⏎";
  } else if (middle === "\n") {
    middle = "⏎\n";
  }

  console.clear();
  console.log(`cursor=${input.cursor}\n`);
  console.log(first + HIGHLIGHT + middle + RESET + second);
  console.log();
};

addInput("ola");
addInput("\n");
addInput("\n");
addInput("e adeus");
addInput("\n");
addInput("xau");

render(input);

process.stdin.setRawMode(true);
process.stdin.setEncoding("utf8");
process.stdin.resume();

process.stdin.on("data", function (key) {
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
    cursorToRight();
  } else if (key === "\u001B\u005B\u0044") {
    cursorToLeft();
  } else if (key === "\u000D") {
    addInput("\n");
  } else if (key === "\u007F") {
    backspace();
  } else {
    addInput(key);
  }

  render(input);
});
