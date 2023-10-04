import clipboard from "clipboardy";
import { Box, Text } from "ink";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import { useGptContext } from "../context.js";
import { request, fakeRequest } from "../gpt.js";
import { AssistantMessage } from "../gptcontext.js";
import { Loading } from "./Loading.js";

const Answer = ({ shouldCopyAnswer = false, onAnswered }) => {
  const [response, setResponse] = useState("");
  const {
    model,
    messages,
    addMessage,
    setQuestionsTokenCount,
    setAnswersTokenCount,
  } = useGptContext();
  // const model = gptContext.model;
  // const messages = gptContext.messages;

  // TODO measure response time (debug mode)

  useEffect(() => {
    console.log("<Answer>\tuseEffect()");

    const get = async () => {
      const apiResponse = await fakeRequest(model, messages);
      // const apiResponse = await request(model, messages);

      // FIXME this is causing a bug: we're pro
      setQuestionsTokenCount(apiResponse.data.usage.prompt_tokens);
      setAnswersTokenCount(apiResponse.data.usage.completion_tokens);

      const firstResponseChoice = apiResponse.data.choices[0];
      setResponse(firstResponseChoice.message.content);
      addMessage(new AssistantMessage(firstResponseChoice.message.content));

      if (shouldCopyAnswer) {
        clipboard.writeSync(firstResponseChoice.message.content);
      }

      onAnswered();
    };
    get();
  }, []);

  // TODO add answer to global context?

  return (
    <Box>
      <Text>{response || <Loading />}</Text>
    </Box>
  );
};

Answer.propTypes = {
  shouldCopyAnswer: PropTypes.bool,
  onAnswered: PropTypes.func.isRequired,
};

export { Answer };
