import React from "react";
import { useGptContext } from "../context.js";
import { Answer } from "./Answer.js";
import { Question } from "./Question.js";

const QuestionMode = () => {
  const { gptContext } = useGptContext();
  const model = gptContext.model;
  const messages = Array.isArray(gptContext.messages)
    ? gptContext.messages
    : [];

  return (
    <>
      <Question messages={messages} />
      <Answer model={model} messages={messages} />
    </>
  );
};

QuestionMode.propTypes = {};

export { QuestionMode };
