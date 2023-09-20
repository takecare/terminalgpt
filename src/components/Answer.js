import clipboard from "clipboardy";
import { Text } from "ink";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useGptContext } from "../context.js";
import { request, fakeRequest } from "../gpt.js";
import { AssistantMessage } from "../gptcontext.js";
import { Loading } from "./Loading.js";

const Answer = ({ shouldCopyAnswer = false, onAnswered }) => {
  const [response, setResponse] = useState();
  const { gptContext, addMessage } = useGptContext();
  const model = gptContext.model;
  const messages = gptContext.messages;

  // TODO measure response time (debug mode)

  useEffect(() => {
    const get = async () => {
      // const apiResponse = await fakeRequest(model, messages);
      const apiResponse = await request(model, messages);
      const response = apiResponse.data.choices[0];
      setResponse(response.message.content);
      addMessage(new AssistantMessage(response.message.content));

      if (shouldCopyAnswer) {
        clipboard.writeSync(response.message.content);
      }

      onAnswered();
    };
    get();
  }, [addMessage, messages, model, onAnswered, shouldCopyAnswer]);

  // TODO add answer to global context?

  return <Text>{response || <Loading />}</Text>;
};

Answer.propTypes = {
  shouldCopyAnswer: PropTypes.bool,
  onAnswered: PropTypes.func.isRequired,
};

export { Answer };
