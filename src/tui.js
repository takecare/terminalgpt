import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useApp, useInput, Box, Text } from "ink";
import { request, fakeRequest } from "./gpt.js";
import { GptContext, Message, UserMessage } from "./gptcontext.js";
import { countTokens } from "./tokenizer.js";

// we're using this listener to capture CTRL + ENTER events. it requires a11y
// services access on macos. an alternative would be iohook but i couldn't get
// that to work. planning on coming back to it later on.
import { GlobalKeyboardListener } from "node-global-key-listener";
import { useGptContext } from "./context.js";
const keyListener = new GlobalKeyboardListener();

class Mode {
  static #_PROMPT = "PROMPT";
  static #_QUESTION = "QUESTION";
  static #_INTERACTIVE = "INTERACTIVE";

  static get PROMPT() {
    return this.#_PROMPT;
  }

  static get QUESTION() {
    return this.#_QUESTION;
  }

  static get INTERACTIVE() {
    return this.#_INTERACTIVE;
  }

  static values() {
    return Object.entries(Object.getOwnPropertyDescriptors(Mode))
      .filter((e) => e[1].get)
      .map((e) => e[0]);
  }
}

const App = ({ mode, isDebug }) => {
  const { context } = useGptContext();
  const model = context.model ? context.model : "";

  return (
    <Box margin={0} width="100%" height="100%" flexDirection="column">
      {isDebug && <Text>Mode: {mode}</Text>}
      {isDebug && <Text>Model: {model}</Text>}
      <TokenEstimation />
      {mode === Mode.PROMPT && <PromptMode />}
      {mode === Mode.QUESTION && <QuestionMode context={context} />}
      {mode === Mode.INTERACTIVE && <InteractiveMode context={context} />}
    </Box>
  );
};

App.propTypes = {
  // context: PropTypes.instanceOf(GptContext).isRequired,
  mode: PropTypes.oneOf(Mode.values()).isRequired,
  isDebug: PropTypes.bool,
};

const TokenEstimation = () => {
  const { context } = useGptContext();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const result = countTokens(context);
    setCount(result);
  });

  // TODO loading while countTokens() doesn't finish...
  // TODO update count with changes to context

  return <Text>Token estimation: {count}</Text>;
};

TokenEstimation.propTypes = {
  // context: PropTypes.instanceOf(GptContext).isRequired,
};

const PromptMode = () => {
  const { context } = useGptContext();
  const model = context.model;
  const messages = Array.isArray(context.messages) ? context.messages : [];

  // const [messages, setMessages] = useState(contextMessages);

  const [isInputting, setIsInputting] = useState(true);
  const [input, setInput] = useState("");

  const handleInput = (text) => {
    setInput(text);
    setIsInputting(false);
  };

  // TODO how to feed input into Answer?
  return (
    <>
      {isInputting && <Input onInput={handleInput} />}
      {!isInputting && (
        <>
          <Text>{input}</Text>
          <Answer model={model} messages={messages} />
        </>
      )}
    </>
  );
};

PromptMode.propTypes = {
  // context: PropTypes.instanceOf(GptContext),
};

const Input = ({ onInput }) => {
  const [isActive, setIsActive] = useState(true);

  const [text, setText] = useState("");
  const [cursor, setCursor] = useState(0);

  const addInput = (newText) => {
    const first = text.slice(0, cursor);
    const second = text.slice(cursor + 1, text.length);
    const middle = newText + (text[cursor] ? text[cursor] : "");

    setText(first + middle + second);
    setCursor(cursor + newText.length);
  };

  const backspace = () => {
    if (cursor === 0) {
      return;
    }

    setText(text.slice(0, cursor - 1) + text.slice(cursor, text.length));
    setCursor(cursor - 1);
  };

  const cursorToLeft = () => {
    if (cursor > 0) {
      setCursor(cursor - 1);
    }
  };

  const cursorToRight = () => {
    if (cursor < text.length) {
      setCursor(cursor + 1);
    }
  };

  const ctrlEnterListener = (e, down) => {
    if (
      e.state === "DOWN" &&
      e.name === "RETURN" &&
      (down["LEFT CTRL"] ||
        down["RIGHT CTRL"] ||
        down["LEFT SHIFT"] ||
        down["RIGHT SHIFT"])
    ) {
      onInput(text);
      return true;
    }
  };

  useEffect(() => {
    keyListener.addListener(ctrlEnterListener);
    return () => keyListener.removeListener(ctrlEnterListener);
  }, [text]);

  useInput(
    (input, key) => {
      if (key.escape) {
        onInput(text); // debug purposes, remove
        setIsActive(false);
      } else if (key.return) {
        addInput("\n");
      } else if (key.backspace) {
        backspace();
      } else if (key.delete) {
        backspace();
      } else if (key.leftArrow) {
        cursorToLeft();
      } else if (key.rightArrow) {
        cursorToRight();
      } else if (key.upArrow) {
        //
      } else if (key.downArrow) {
        //
      } else {
        addInput(input);
      }
    },
    { isActive }
  );

  const first = text.slice(0, cursor);
  const second = text.slice(cursor + 1, text.length);
  const middle = !text[cursor]
    ? " "
    : text[cursor] === "\n"
    ? "⏎\n"
    : text[cursor];

  const UNDERLINE = "\x1b[4m";
  const RESET = "\x1b[0m";

  return (
    <Box flexDirection="row">
      <Text>{first + UNDERLINE + middle + RESET + second}</Text>
    </Box>
  );
};

Input.propTypes = {
  onInput: PropTypes.func.isRequired,
};

const QuestionMode = () => {
  const { context } = useGptContext();
  const model = context.model;
  const messages = Array.isArray(context.messages) ? context.messages : [];

  return (
    <>
      <Question messages={messages} />
      <Answer model={model} messages={messages} />
    </>
  );
};

QuestionMode.propTypes = {
  // context: PropTypes.instanceOf(GptContext),
};

const InteractiveMode = () => {
  const { context } = useGptContext();
  //
  return <></>;
};

InteractiveMode.propTypes = {
  // context: PropTypes.instanceOf(GptContext),
};

const Question = ({ messages }) => {
  const questionContent = messages.find(
    (m) => m instanceof UserMessage
  ).content;

  return (
    <Box flexDirection="column">
      <Text>Question: {questionContent}</Text>
    </Box>
  );
};

Question.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
};

const Answer = ({ model, messages }) => {
  // https://github.com/vadimdemedes/ink#useapp
  const { exit } = useApp();
  const [response, setResponse] = useState();

  // TODO offer to copy answer?
  // TODO measure response time (debug mode)

  useEffect(() => {
    const get = async () => {
      const apiResponse = await fakeRequest(model, messages);
      // const apiResponse = await request(model, messages);
      const response = apiResponse.data.choices[0];
      setResponse(response.message.content);
      exit();
    };
    get();
  }, [messages]);

  return (
    <>
      <Text>Response: {response || <Loading />}</Text>
    </>
  );
};

Answer.propTypes = {
  model: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
  exit: PropTypes.func,
};

const Loading = () => {
  const PROGRESS_BAR_LENGTH = 4;
  const REFRESH_INTERVAL_MILLIS = 200;

  const [progress, setProgress] = useState(".");

  useEffect(() => {
    const id = setInterval(() => {
      if (progress.length <= PROGRESS_BAR_LENGTH) {
        setProgress(`${progress} .`);
      } else {
        setProgress(".");
      }
    }, REFRESH_INTERVAL_MILLIS);
    return () => {
      clearInterval(id);
    };
  });

  return (
    <>
      <Text>{progress}</Text>
    </>
  );
};

const spinner = {
  interval: 80,
  frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
};

export { App, Mode };
