import PropTypes from "prop-types";
import React from "react";
import { useGptContext } from "../context.js";
import { Answer } from "./Answer.js";
import { Question } from "./Question.js";

const QuestionMode = ({ shouldCopyAnswer = false }) => {
  const { gptContext } = useGptContext();
  const model = gptContext.model;
  const messages = Array.isArray(gptContext.messages)
    ? gptContext.messages
    : [];

  return (
    <>
      <Question messages={messages} />
      <Answer
        model={model}
        messages={messages}
        shouldCopyAnswer={shouldCopyAnswer}
      />
    </>
  );
};

QuestionMode.propTypes = {
  shouldCopyAnswer: PropTypes.bool,
};

export { QuestionMode };
