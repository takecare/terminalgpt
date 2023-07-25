import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useApp, Box, Text } from "ink";
import { fakeRequest } from "./gpt.js";
import { Context, Message } from "./context.js";

const App = ({ context, onDone }) => {
  const { exit } = useApp();
  const mode = context.mode;
  const model = context.model ? context.model : "";
  const messages = Array.isArray(context.messages)
    ? context.messages
    : [];

  return (
    <Box margin={2} width="100%" height="100%" flexDirection="column">
      <Text>Mode: {mode}</Text>
      <Text>Model: {model}</Text>
      {mode === "question" ? <Question messages={messages} /> : <Text></Text>}
    </Box>
  );
};

App.propTypes = {
  context: PropTypes.instanceOf(Context),
  onDone: PropTypes.func.isRequired,
};

const Question = ({ messages }) => {
  const content = messages[0].content;
  console.log("messages:", messages);
  console.log("instance:", messages[0] instanceof Message);

  useEffect(() => {
    const get = async () => {
      const response = await fakeRequest();
      console.log(response);
    };
    get();
  }, [messages]);

  return (
    <Box flexDirection="column">
      <Text>Question: {content}</Text>
    </Box>
  );
};

Question.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
};

export { App };
