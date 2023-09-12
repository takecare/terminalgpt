import { Text, useApp } from "ink";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { request, fakeRequest } from "../gpt.js";
import { Message } from "../gptcontext.js";
import { Loading } from "./Loading.js";
// import clipboard from "clipboardy";

const Answer = ({ model, messages }) => {
  const { exit } = useApp(); // https://github.com/vadimdemedes/ink#useapp
  const [response, setResponse] = useState();

  // TODO offer to copy answer? what's the best ux for this?
  // TODO measure response time (debug mode)

  useEffect(() => {
    const get = async () => {
      const apiResponse = await fakeRequest(model, messages);
      // const apiResponse = await request(model, messages);
      const response = apiResponse.data.choices[0];
      setResponse(response.message.content);

      // clipboard.writeSync(response.message.content);

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
