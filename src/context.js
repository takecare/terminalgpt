import PropTypes from "prop-types";
import React, { useContext, useState } from "react";
import { GptContext, UserMessage } from "./gptcontext.js";
import { DEFAULT_MODEL } from "./gpt.js";

const Context = React.createContext();

const GptContextProvider = ({ children, initialQuestion }) => {
  const [model, setModel] = useState(DEFAULT_MODEL);
  // const [gptContext, setGptContext] = useState(context);

  const [messages, setMessages] = useState(
    initialQuestion ? [initialQuestion] : []
  );

  const [promptTokenCount, setPromptTokenCount] = useState(0);
  const [completionsTokenCount, setCompletionsTokenCount] = useState(0);

  // TODO consider dropping GptContext (from gptcontext.js) and use react's
  // context only

  const ctx = {
    // gptContext,
    model,
    messages,
    promptTokenCount,
    completionsTokenCount,
    setQuestionsTokenCount: (count) => {
      setPromptTokenCount(promptTokenCount + count);
    },
    setAnswersTokenCount: (count) => {
      setCompletionsTokenCount(completionsTokenCount + count);
    },
    addMessage: (message) => {
      // gptContext.add(message);
      // setGptContext(gptContext);
      setMessages([...messages, message]);
    },
  };

  return <Context.Provider value={ctx}>{children}</Context.Provider>;
};

GptContextProvider.propTypes = {
  // context: PropTypes.instanceOf(GptContext).isRequired,
  initialQuestion: PropTypes.instanceOf(UserMessage),
  children: PropTypes.node.isRequired,
};

const useGptContext = () => useContext(Context);

export { GptContextProvider, useGptContext };
