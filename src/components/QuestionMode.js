import { useApp } from "ink";
import PropTypes from "prop-types";
import React from "react";
import { useGptContext } from "../context.js";
import { Answer } from "./Answer.js";
import { Question } from "./Question.js";

const QuestionMode = ({ shouldCopyAnswer = false }) => {
  const { exit } = useApp();
  const { model, messages } = useGptContext();
  // const messages = Array.isArray(messages)
  //   ? gptContext.messages
  //   : [];

  return (
    <>
      <Question messages={messages} />
      <Answer
        model={model}
        messages={messages}
        shouldCopyAnswer={shouldCopyAnswer}
        onAnswered={() => {
          exit();
        }}
      />
    </>
  );
};

QuestionMode.propTypes = {
  shouldCopyAnswer: PropTypes.bool,
};

export { QuestionMode };
