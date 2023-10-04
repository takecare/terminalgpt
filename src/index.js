//
// #!/usr/bin/env NODE_NO_WARNINGS=1 node --loader=import-jsx
// https://github.com/vadimdemedes/import-jsx ⤴

import { Command } from "commander";
import { DEFAULT_MODEL } from "./gpt.js";
import { UserMessage } from "./gptcontext.js";

import { render } from "ink";
import React from "react";
import { App } from "./components/App.js";
import { GptContextProvider } from "./context.js";
import Mode from "./mode.js";

if (!process.env.OPENAI_API_KEY) {
  console.error("No OpenAI API key found. Please set it via OPENAI_API_KEY.");
  process.exit(1);
}

const program = new Command();

/** main() allows us to easily bridge Commander and ink together. as Commander
 * is our entry point we have to wait for it to process the input from the
 * shell - i.e. command args - before we render our app with ink. */
const main = async (mode, initialQuestion) => {
  const isDebug = program.opts().debug || !!process.env.DEBUG;
  const shouldCopyAnswer = program.opts().copy;

  // FIXME not super stoked about having main() and by extension the App
  // component accept a "mode" parameter. that logic/decision is necessary but
  // maybe it should happen here.

  // https://github.com/vadimdemedes/ink#rendertree-options
  const app = render(
    <GptContextProvider initialQuestion={initialQuestion}>
      <App mode={mode} isDebug={isDebug} shouldCopyAnswer={shouldCopyAnswer} />
    </GptContextProvider>
  );
  await app.waitUntilExit();
};

program
  .name("TerminalGPT")
  .description("CLI tool to interact with the OpenAI API.")
  .version("0.0.1");

program.option(
  "-m, --model <model>",
  "Define the model you're interacting with.",
  DEFAULT_MODEL
);

program.option("-d, --debug", "Activate debug mode.");

program.option("-c, --copy", "Copy answer to clipboard.");

program
  .command("question")
  .alias("q")
  .description("Ask a single (one-shot) question to one of OpenAI's models.")
  .argument("<question...>", "The question to ask.")
  .action((q, _options, _command) => {
    // q is the question argument, which can be an array containing many strings
    // if not using quotes or an array with just an element (the whole question)
    main(Mode.QUESTION, new UserMessage(q[0]));
  });

program
  .command("prompt")
  .alias("p")
  .description(
    "Pop up a prompt to formulate a single (one-shot) question to the model."
  )
  .action((_q, _options, _command) => {
    // we don't care about any question passed here as we'll provide an input
    main(Mode.PROMPT);
  });

program
  .command("interactive")
  .alias("i")
  .description(
    "Enter the interactive mode where you can have a chat with the model."
  )
  .argument("[question...]", "An optional question to kickstart the session.")
  .action((q, _options, _command) => {
    // we don't care about any question passed here as we'll provide an input
    main(Mode.INTERACTIVE);
  });

program
  .command("default", { hidden: true, isDefault: true })
  .action((_options, _command) => {
    if (program.args.length === 0) {
      main(Mode.INTERACTIVE);
    } else if (program.args.length > 0) {
      const question = program.args.reduce((acc, s) => `${acc} ${s}`);
      main(Mode.QUESTION, new UserMessage(question));
    }
  });

program.parse();
