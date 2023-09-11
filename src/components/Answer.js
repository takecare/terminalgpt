import { Text, useApp } from "ink";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Message } from "../gptcontext.js";
import { Loading } from "./Loading.js";
import { fakeRequest } from "../gpt.js";

const Answer = ({ model, messages }) => {
  const { exit } = useApp(); // https://github.com/vadimdemedes/ink#useapp
  const [response, setResponse] = useState();

  // TODO offer to copy answer?
  // TODO measure response time (debug mode)

  useEffect(() => {
    const get = async () => {
      const apiResponse = await fakeRequest(model, messages);
      // const apiResponse = await request(model, messages);
      const response = apiResponse.data.choices[0];
      setResponse(response.message.content);
      exit(); // FIXME this needs to be removed for interactive mode
    };
    get();
  }, [messages]);

  return <Text>Response: {response || <Loading />}</Text>;
};

Answer.propTypes = {
  model: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
  exit: PropTypes.func,
};

export { Answer };
