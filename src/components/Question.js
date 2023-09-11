import { Box, Text } from "ink";
import PropTypes from "prop-types";
import React from "react";
import { Message, UserMessage } from "../gptcontext.js";

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

export { Question };
