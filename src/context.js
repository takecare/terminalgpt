import React, { useContext, useState } from "react";
import PropTypes from "prop-types";

import { GptContext, UserMessage } from "./gptcontext.js";

const Context = React.createContext();

const GptContextProvider = ({ context, children }) => {
  const [gptContext, setGptContext] = useState(context);

  const ctx = {
    gptContext,
    addMessage: (message) => {
      gptContext.add(new UserMessage(message));
      setGptContext(gptContext);
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
