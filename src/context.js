import React, { useContext, useState } from "react";
import PropTypes from "prop-types";

import { GptContext } from "./gptcontext.js";

const Context = React.createContext();

const GptContextProvider = ({ context, children }) => {
  const [state] = useState(context);
  // no fancy context logic here
  return <Context.Provider value={state}>{children}</Context.Provider>;
};

GptContextProvider.propTypes = {
  context: PropTypes.instanceOf(GptContext).isRequired,
  children: PropTypes.node.isRequired,
};

const useGptContext = () => useContext(Context);

export { GptContextProvider, useGptContext };
