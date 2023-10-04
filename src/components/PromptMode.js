import { Text, useApp } from "ink";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useGptContext } from "../context.js";
import { UserMessage } from "../gptcontext.js";
import { Answer } from "./Answer.js";
import { Input } from "./Input.js";

const PromptMode = ({ input, updateInput }) => {
  const { model, messages, addMessage } = useGptContext();
  const { exit } = useApp();

  const [isInputting, setIsInputting] = useState(true);

  const handleInput = (text) => {
    updateInput(text);
  };

  const handleSubmit = (text) => {
    addMessage(new UserMessage(text));
    setIsInputting(false);
  };

  return (
    <>
      {isInputting && <Input onInput={handleInput} onSubmit={handleSubmit} />}
      {!isInputting && (
        <>
          <Text>{input}</Text>
          <Answer model={model} messages={messages} onAnswered={() => exit()} />
        </>
      )}
    </>
  );
};

PromptMode.propTypes = {
  input: PropTypes.string.isRequired,
  updateInput: PropTypes.func.isRequired,
};

export { PromptMode };
