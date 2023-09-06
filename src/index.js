//
// #!/usr/bin/env NODE_NO_WARNINGS=1 node --loader=import-jsx
// https://github.com/vadimdemedes/import-jsx ⤴

import { Command } from "commander";
import { DEFAULT_MODEL } from "./gpt.js";
import { GptContext } from "./gptcontext.js";
import { question, prompt, interactive } from "./commands.js";

import React from "react";
import { render } from "ink";
import { App, Mode } from "./tui.js";
import { GptContextProvider } from "./context.js";

if (!process.env.OPENAI_API_KEY) {
  console.error("No OpenAI API key found. Please set it via OPENAI_API_KEY.");
  process.exit(1);
}

const program = new Command();
const context = new GptContext();

/** main() allows us to easily bridge Commander and ink together. as Commander
 * is our entry point we have to wait for it to process the input from the
 * shell - i.e. command args - before we render our app with ink. */
const main = async (mode, context) => {
  const isDebug = program.opts().debug || !!process.env.DEBUG;

  // FIXME not super stoked about having main() and by extension the App
  // component accept a "mode" parameter. that logic/decision is necessary but
  // maybe it should happen here.

  // https://github.com/vadimdemedes/ink#rendertree-options
  const app = render(
    <GptContextProvider context={context}>
      <App mode={mode} isDebug={isDebug} />
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

program
  .command("question")
  .alias("q")
  .description("Ask a single (one-shot) question to one of OpenAI's models.")
  .argument("<question...>", "The question to ask.")
  .action((q, _options, _command) => {
    // q is the question argument, which can be an array containing many strings
    // if not using quotes or an array with just an element (the whole question)
    console.log("question mode - options:", program.opts());

    const ask = question(context, (context) => main(Mode.QUESTION, context));
    ask(q, program.opts());
  });

program
  .command("prompt")
  .alias("p")
  .description(
    "Pop up a prompt to formulate a single (one-shot) question to the model."
  )
  .action((_q, _options, _command) => {
    // we don't care about any question passed here as we'll provide an input
    const p = prompt(context, (context) => main(Mode.PROMPT, context));
    p(program.opts());
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
    const interact = interactive(context, (context) =>
      main(Mode.INTERACTIVE, context)
    );
    interact(q, program.opts());
  });

program
  .command("default", { hidden: true, isDefault: true })
  .action((_options, _command) => {
    console.log("options:", program.opts()); // debug, remove! @rui

    if (program.args.length === 0) {
      const interact = interactive(context, (context) =>
        main(Mode.INTERACTIVE, context)
      );
      interact(program.args, program.opts());
    } else if (program.args.length > 0) {
      const ask = question(context, (context) => main(Mode.QUESTION, context));
      ask(program.args, program.opts());
    }
  });

program.parse();
