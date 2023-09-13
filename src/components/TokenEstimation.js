import { Loading } from "./Loading.js";
import { Box, Text } from "ink";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useGptContext } from "../context.js";
import { countTokens } from "../tokenizer.js";

/**
 *
 * @param {string} input: any current input for live token count (useful for
 * prompt and interactive modes, where the user types the question in, rather
 * than having it passed via a command-line argument)
 */
const TokenEstimation = ({ input }) => {
  const { gptContext } = useGptContext();
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const messages = gptContext.messages.map((m) => m.content);
    const result = countTokens(input ? [...messages, input] : messages);

    setCount(result);
    setIsLoading(false);
  }, [gptContext, input]);

  return (
    <Box flexDirection="row">
      <Text>Token estimation: </Text>
      {isLoading ? <Loading /> : <Text>{count}</Text>}
    </Box>
  );
};

TokenEstimation.propTypes = {
  input: PropTypes.string,
};

export { TokenEstimation };
