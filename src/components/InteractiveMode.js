import PropTypes from "prop-types";
import React from "react";
import { useGptContext } from "../context.js";

const InteractiveMode = () => {
  const { gptContext } = useGptContext();
  //
  return <></>;
};

InteractiveMode.propTypes = {
  input: PropTypes.string.isRequired,
  updateInput: PropTypes.func.isRequired,
};

export { InteractiveMode };
