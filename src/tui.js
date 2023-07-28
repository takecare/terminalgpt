import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useApp, Box, Text } from "ink";
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
  //
  return <></>;
};

PromptMode.propTypes = {
  context: PropTypes.instanceOf(Context),
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

export { App, Mode };
