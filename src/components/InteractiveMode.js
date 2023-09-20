import { Box, Text, useApp } from "ink";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useGptContext } from "../context.js";
import { UserMessage } from "../gptcontext.js";
import { Answer } from "./Answer.js";
import { Input } from "./Input.js";

const InteractiveMode = ({ input, updateInput }) => {
  const { gptContext, addMessage } = useGptContext();
  const model = gptContext.model;
  const messages = gptContext.messages;
  const { exit } = useApp();

  const [isInputting, setIsInputting] = useState(true);

  const handleInput = (text) => {
    updateInput(text);
  };

  const handleSubmit = (text) => {
    if (text.trim().length === 0) {
      exit();
      return;
    }
    addMessage(new UserMessage(text));
    setIsInputting(false);
  };

  // TODO how to finish? detect CTRL+C? empty question? .exit as input?
  // need to alternate constantly between input and and answer - maybe we can
  // do this by mapping 'messages' to components

  const history = messages.slice(1, messages.length).map((m, i) => (
    <Box key={i}>
      {m instanceof UserMessage ? <Text>Q: </Text> : <Text>A: </Text>}
      <Text>{m.content}</Text>
    </Box>
  ));

  return (
    <>
      {history}
      {isInputting && (
        <Box>
          <Text>Q: </Text>
          <Input onInput={handleInput} onSubmit={handleSubmit} />
        </Box>
      )}
      {!isInputting && (
        <Box>
          <Text>A: </Text>
          <Answer
            model={model}
            messages={messages}
            onAnswered={() => {
              setIsInputting(true);
            }}
          />
        </Box>
      )}
    </>
  );
};

InteractiveMode.propTypes = {
  input: PropTypes.string.isRequired,
  updateInput: PropTypes.func.isRequired,
};

export { InteractiveMode };
