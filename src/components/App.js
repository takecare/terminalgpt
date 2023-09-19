import { Box, Text } from "ink";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useGptContext } from "../context.js";
import Mode from "../mode.js";
import { InteractiveMode } from "./InteractiveMode.js";
import { PromptMode } from "./PromptMode.js";
import { QuestionMode } from "./QuestionMode.js";
import { TokenEstimation } from "./TokenEstimation.js";

const App = ({ mode, isDebug = false, shouldCopyAnswer = false }) => {
  const { gptContext } = useGptContext();
  const model = gptContext.model ? gptContext.model : "";

  const [input, updateInput] = useState("");

  return (
    <Box margin={0} width="100%" height="100%" flexDirection="column">
      {isDebug && <Text>Mode: {mode}</Text>}
      {isDebug && <Text>Model: {model}</Text>}
      <TokenEstimation input={input} />
      {mode === Mode.PROMPT && (
        <PromptMode input={input} updateInput={(text) => updateInput(text)} />
      )}
      {mode === Mode.QUESTION && (
        <QuestionMode shouldCopyAnswer={shouldCopyAnswer} />
      )}
      {mode === Mode.INTERACTIVE && (
        <InteractiveMode
          input={input}
          updateInput={(text) => updateInput(text)}
        />
      )}
    </Box>
  );
};

App.propTypes = {
  mode: PropTypes.oneOf(Mode.values()).isRequired,
  isDebug: PropTypes.bool,
  // TODO consider having shouldCopyAnswer as part of the context to avoid drilling props
  shouldCopyAnswer: PropTypes.bool,
};

export { App };
