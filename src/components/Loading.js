import { Text } from "ink";
import React, { useEffect, useState } from "react";

const Loading = () => {
  const spinner = {
    interval: 80, // millis
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
  };

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      if (progress < spinner.frames.length) {
        setProgress(progress + 1);
      } else {
        setProgress(0);
      }
    }, spinner.interval);
    return () => {
      clearInterval(id);
    };
  });

  return <Text>{spinner.frames[progress]}</Text>;
};

Loading.propTypes = {};

export { Loading };
