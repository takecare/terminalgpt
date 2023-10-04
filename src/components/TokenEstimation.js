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
  const { gptContext, promptTokenCount, completionsTokenCount } =
    useGptContext();
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const result = countTokens([input]);
    const total = result + promptTokenCount + completionsTokenCount;
    setCount(total);
    setIsLoading(false);
  }, [gptContext, promptTokenCount, completionsTokenCount, input]);

  // TODO how to flip between "estimation mode" and "count mode"?

  return (
    <Box flexDirection="row">
      <Text>Token estimation: </Text>
      {/* {input ? <Text>Token estimation: </Text> : <Text>Token count: </Text>} */}
      {isLoading ? <Loading /> : <Text>{count}</Text>}
    </Box>
  );
};

TokenEstimation.propTypes = {
  input: PropTypes.string,
};

export { TokenEstimation };
