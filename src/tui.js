import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useApp, useInput, Box, Text } from "ink";
import { request, fakeRequest } from "./gpt.js";
import { Context, Message, UserMessage } from "./context.js";
import { countTokens } from "./tokenizer.js";

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

const App = ({ context, mode, isDebug }) => {
  const model = context.model ? context.model : "";

  return (
    <Box margin={0} width="100%" height="100%" flexDirection="column">
      {isDebug && <Text>Mode: {mode}</Text>}
      {isDebug && <Text>Model: {model}</Text>}
      <TokenEstimation context={context} />
      {mode === Mode.PROMPT && <PromptMode context={context} />}
      {mode === Mode.QUESTION && <QuestionMode context={context} />}
      {mode === Mode.INTERACTIVE && <InteractiveMode context={context} />}
    </Box>
  );
};

App.propTypes = {
  context: PropTypes.instanceOf(Context).isRequired,
  mode: PropTypes.oneOf(Mode.values()).isRequired,
  isDebug: PropTypes.bool,
};

const TokenEstimation = ({ context }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const result = countTokens(context);
    setCount(result);
  });
  return <Text>Token estimation: {count}</Text>;
};

TokenEstimation.propTypes = {
  context: PropTypes.instanceOf(Context).isRequired,
};

const PromptMode = ({ context }) => {
  const [isInputting, setIsInputting] = useState(true);
  const [input, setInput] = useState("");

  const handleInput = (text) => {
    setInput(text);
    setIsInputting(false);
  };

  //
  return (
    <>
      {isInputting && <Input onInput={handleInput} />}
      {!isInputting && <Text>{input}</Text>}
    </>
  );
};

PromptMode.propTypes = {
  context: PropTypes.instanceOf(Context),
};

const Input = ({ onInput }) => {
  const [isActive, setIsActive] = useState(true);

  const [text, setText] = useState("");
  const [cursor, setCursor] = useState(0);

  const ENTER_MAX = 3;
  const [enterCount, setEnterCount] = useState(0);

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

  useInput(
    (input, key) => {
      if (!key.return) {
        setEnterCount(0);
      } else {
        setEnterCount(enterCount + 1);
      }

      if (enterCount === ENTER_MAX) {
        onInput(text);
        return;
      }

      if (key.escape) {
        setIsActive(false);
      } else if (key.return) {
        addInput("\n");
      } else if (key.backspace) {
        backspace();
      } else if (key.delete) {
        backspace();
      } else if (key.leftArrow && text) {
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

  return (
    <Box flexDirection="column">
      <Box flexDirection="column">
        <Text>{text}</Text>
      </Box>
    </Box>
  );
};

Input.propTypes = {
  onInput: PropTypes.func.isRequired,
};

const QuestionMode = ({ context }) => {
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
  context: PropTypes.instanceOf(Context),
};

const InteractiveMode = ({ context }) => {
  //
  return <></>;
};

InteractiveMode.propTypes = {
  context: PropTypes.instanceOf(Context),
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
