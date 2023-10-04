import PropTypes from "prop-types";
import React, { useContext, useState } from "react";
import { UserMessage } from "./gptcontext.js";
import { DEFAULT_MODEL } from "./gpt.js";

const Context = React.createContext();

const GptContextProvider = ({ children, initialQuestion }) => {
  const [model, setModel] = useState(DEFAULT_MODEL);

  const [messages, setMessages] = useState(
    initialQuestion ? [initialQuestion] : []
  );

  const [promptTokenCount, setPromptTokenCount] = useState(0);
  const [completionsTokenCount, setCompletionsTokenCount] = useState(0);

  const ctx = {
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
      setMessages([...messages, message]);
    },
  };

  return <Context.Provider value={ctx}>{children}</Context.Provider>;
};

GptContextProvider.propTypes = {
  initialQuestion: PropTypes.instanceOf(UserMessage),
  children: PropTypes.node.isRequired,
};

const useGptContext = () => useContext(Context);

export { GptContextProvider, useGptContext };
