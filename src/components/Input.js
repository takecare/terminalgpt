import { Box, Text, useInput } from "ink";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";

// we're using this listener to capture CTRL + ENTER events. it requires a11y
// services access on macos. an alternative would be iohook but i couldn't get
// that to work. planning on coming back to it later on.
import { GlobalKeyboardListener } from "node-global-key-listener";
const keyListener = new GlobalKeyboardListener();

const Input = ({ onInput, onSubmit }) => {
  const [isActive, setIsActive] = useState(true);

  const [text, setText] = useState("");
  const [cursor, setCursor] = useState(0);

  const addInput = useCallback(
    (newText) => {
      const first = text.slice(0, cursor);
      const second = text.slice(cursor + 1, text.length);
      const middle = newText + (text[cursor] ? text[cursor] : "");

      setText(first + middle + second);
      setCursor(cursor + newText.length);
    },
    [text, cursor]
  );

  const backspace = () => {
    if (cursor === 0) {
      return;
    }

    setText(text.slice(0, cursor - 1) + text.slice(cursor, text.length));
    setCursor(cursor - 1);
  };

  const cursorToLeft = () => {
    if (cursor > 0) {
      setCursor(cursor - 1);
    }
  };

  const cursorToRight = () => {
    if (cursor < text.length) {
      setCursor(cursor + 1);
    }
  };

  useEffect(() => {
    const newLineEnteredListener = (e, down) => {
      if (
        e.state === "DOWN" &&
        e.name === "RETURN" &&
        (down["LEFT CTRL"] ||
          down["RIGHT CTRL"] ||
          down["LEFT SHIFT"] ||
          down["RIGHT SHIFT"])
      ) {
        addInput("\n");
        return true;
      }
    };

    keyListener.addListener(newLineEnteredListener);
    return () => keyListener.removeListener(newLineEnteredListener);
  }, [text, addInput]);

  useInput(
    (input, key) => {
      if (key.escape) {
        setIsActive(false);
      } else if (key.return) {
        onSubmit(text);
      } else if (key.backspace) {
        backspace();
      } else if (key.delete) {
        backspace();
      } else if (key.leftArrow) {
        cursorToLeft();
      } else if (key.rightArrow) {
        cursorToRight();
      } else if (key.upArrow) {
        //
      } else if (key.downArrow) {
        //
      } else {
        addInput(input);
      }
      onInput(text);
    },
    { isActive }
  );

  const first = text.slice(0, cursor);
  const second = text.slice(cursor + 1, text.length);
  const middle = !text[cursor]
    ? " "
    : text[cursor] === "\n"
    ? "⏎\n"
    : text[cursor];

  const UNDERLINE = "\x1b[4m";
  const RESET = "\x1b[0m";

  return (
    <Box flexDirection="row">
      <Text>{first + UNDERLINE + middle + RESET + second}</Text>
    </Box>
  );
};

Input.propTypes = {
  onInput: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export { Input };
