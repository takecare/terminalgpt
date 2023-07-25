import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useApp, Box, Text } from "ink";
import { fakeRequest } from "./gpt.js";
import { Context, Message } from "./context.js";

const App = ({ context, onDone }) => {
  const { exit } = useApp();
  const mode = context.mode;
  const model = context.model ? context.model : "";
  const messages = Array.isArray(context.messages) ? context.messages : [];

  return (
    <Box margin={2} width="100%" height="100%" flexDirection="column">
      <Text>Mode: {mode}</Text>
      <Text>Model: {model}</Text>
      {mode === "question" ? <Question messages={messages} /> : <Text></Text>}
      <Answer messages={messages} />
    </Box>
  );
};

App.propTypes = {
  context: PropTypes.instanceOf(Context),
  onDone: PropTypes.func.isRequired,
};

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

const Answer = ({messages}) => {
  const [response, setResponse] = useState();
  useEffect(() => {
    const get = async () => {
      const apiResponse = await fakeRequest();
      const response = apiResponse.data.choices[0];
      setResponse(response.message.content);
    };
    get();
  }, [messages]);
  return (
    <>
      <Text>Response: {response || "..."}</Text>
    </>
  );
};

Answer.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
}

export { App };
