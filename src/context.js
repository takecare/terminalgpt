import React, { useContext, useState } from "react";
import PropTypes from "prop-types";

import { GptContext } from "./gptcontext.js";

const Context = React.createContext();

const GptContextProvider = ({ context, children }) => {
  const [state, setState] = useState(context);
  // no fancy context logic here

  const ctx = {
    context,
    addMessage: (message) => {
      const newContext = state.addMessage(message);
      setState(newContext);
    },
  };

  return <Context.Provider value={ctx}>{children}</Context.Provider>;
};

GptContextProvider.propTypes = {
  context: PropTypes.instanceOf(GptContext).isRequired,
  children: PropTypes.node.isRequired,
};

const useGptContext = () => useContext(Context);

export { GptContextProvider, useGptContext };
