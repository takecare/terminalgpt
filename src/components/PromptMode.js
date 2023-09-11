import { Text } from "ink";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useGptContext } from "../context.js";
import { Answer } from "./Answer.js";
import { Input } from "./Input.js";

const PromptMode = ({ input, updateInput }) => {
  const { gptContext, addMessage } = useGptContext();
  const model = gptContext.model;
  const messages = gptContext.messages;

  const [isInputting, setIsInputting] = useState(true);

  const handleInput = (text) => {
    updateInput(text);
  };

  const handleSubmit = (text) => {
    addMessage(text);
    setIsInputting(false);
  };

  return (
    <>
      {isInputting && <Input onInput={handleInput} onSubmit={handleSubmit} />}
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
  input: PropTypes.string.isRequired,
  updateInput: PropTypes.func.isRequired,
};

export { PromptMode };
