import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useApp, Box, Text } from "ink";
import { fakeRequest } from "./gpt.js";
import { Context, Message } from "./context.js";

class Mode {
  static #_PROMPT = "prompt";
  static #_QUESTION = "question";
  static #_INTERACTIVE = "interactive";

  static get PROMPT() { return this.#_PROMPT; }
  static get QUESTION() { return this.#_QUESTION; }
  static get INTERACTIVE() { return this.#_INTERACTIVE; }
}

const App = ({ context, mode, isDebug }) => {
  const model = context.model ? context.model : "";

  return (
    <Box margin={0} width="100%" height="100%" flexDirection="column">
      {isDebug && <Text>Mode: {mode}</Text>}
      {isDebug && <Text>Model: {model}</Text>}
      <Text>Token estimation: TODO</Text>
      {mode === Mode.PROMPT && <PromptMode context={context} />}
      {mode === Mode.QUESTION && <QuestionMode context={context} />}
      {mode === Mode.INTERACTIVE && <InteractiveMode context={context} />}
    </Box>
  );
};

App.propTypes = {
  context: PropTypes.instanceOf(Context).isRequired,
  mode: PropTypes.oneOf([Mode.PROMPT, Mode.QUESTION, Mode.INTERACTIVE]).isRequired,
  isDebug: PropTypes.bool,
};

const PromptMode = ({context}) => {
  //
  return (<></>);
}

PromptMode.propTypes = {
  context: PropTypes.instanceOf(Context),
}

const QuestionMode = ({context}) => {
  const messages = Array.isArray(context.messages) ? context.messages : [];

  return (
    <>
      <Question messages={messages} />
      <Answer messages={messages} />
    </>
  )
}

QuestionMode.propTypes = {
  context: PropTypes.instanceOf(Context),
}

const InteractiveMode = ({context}) => {
  //
  return (<></>);
}

InteractiveMode.propTypes = {
  context: PropTypes.instanceOf(Context),
}

const Question = ({ messages }) => {
  const questionContent = messages[0].content;

  return (
    <Box flexDirection="column">
      <Text>Question: {questionContent}</Text>
    </Box>
  );
};

Question.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
};

const Answer = ({ messages }) => {
  // https://github.com/vadimdemedes/ink#useapp
  const { exit } = useApp();
  const [response, setResponse] = useState();

  useEffect(() => {
    const get = async () => {
      const apiResponse = await fakeRequest();
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
  messages: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
  exit: PropTypes.func,
};

const Loading = () => {
  const PROGRESS_BAR_LENGTH = 4;
  const REFRESH_INTERVAL_MILLIS = 200;

  const [progress, setProgress] = useState(".");

  useEffect(() => {
    const id = setTimeout(() => {
      if (progress.length <= PROGRESS_BAR_LENGTH) {
        setProgress(`${progress} .`);
      } else {
        setProgress(".");
      }
    }, REFRESH_INTERVAL_MILLIS);
    return () => {
      clearTimeout(id);
    }
  });

  return <><Text>{progress}</Text></>;
};

export { App, Mode };
