#!/usr/bin/env NODE_NO_WARNINGS=1 node --loader=import-jsx
// https://github.com/vadimdemedes/import-jsx ⤴
import { Command } from "commander";
import { DEFAULT_MODEL } from "./gpt.js";
// import { countTokens } from "./tokenizer.js";
import { Context } from "./context.js";
import { question, prompt, interactive } from "./commands.js";

// import React from "react";
// import { render } from "ink";
// import { Demo } from "./tui.js";

import "dotenv/config"; // load .env file into process.env

if (!process.env.OPENAI_API_KEY) {
  console.error("No OpenAI API key found. Please set it via OPENAI_API_KEY.");
  process.exit(1);
}
const program = new Command();
const context = new Context();
program.name("TerminalGPT").description("CLI tool to interact with the OpenAI API.").version("0.0.1");
program.option("-m, --model <model>", "Define the model you're interacting with.", DEFAULT_MODEL);
program.command("question").alias("q").description("Ask a single (one-shot) question to one of OpenAI's models.").argument("<question...>", "The question to ask.").action((q, _options, _command) => {
  // q is the question argument, which can be an array containing many strings
  // if not using quotes or an array with just an element (the whole question)
  const ask = question(context);
  ask(q, program.opts());
});
program.command("prompt").alias("p").description("...").action((_q, _options, _command) => {
  // we don't care about any question passed here, we'll provide an input
  const p = prompt(context);
  p(program.opts());
});
program.command("interactive").alias("i").description("...").argument("[question...]", "An optional question to kickstart the session.").action((q, _options, _command) => {
  //
  const interact = interactive(context);
  interact(q, program.opts());
});
program.command("default", {
  hidden: true,
  isDefault: true
}).action((_options, _command) => {
  console.log("default");
  if (program.args.length === 0) {
    const interact = interactive(context);
    interact(program.args, program.opts());
  } else if (program.args.length > 0) {
    const ask = question(context);
    ask(program.args, program.opts());
  }
});
program.parse();

// render(<Demo />);
// console.log(countTokens(context));

// messages.push(userMessage("can you tell me about s. joão festivities in porto?"));
// request(messages)
//     .then(response => {
//       const status = response.status;
//       const statusText = response.statusText;
//       const headers = response.headers;
//       const input = response.config.data; // the message we sent

//       const data = response.data;
//       const createdAt = response.data.created;
//       const model = response.data.model;
//       const choices = response.data.choices;
//       const usage = response.data.usage;
//       const totalUsage = response.data.usage.total_tokens;

//       const message = response.data.choices[0].message;
//       const role = message.role;
//       const content = message.content;

//       console.log(`prompt token count: ${usage.prompt_tokens}`);
//       console.log(`completion token count: ${usage.completion_tokens}`);
//       console.log(`answer: ${content}`);
//     })
//     .catch(e => {
//       console.error("error:", e.response);
//       // console.error(`${e.response.status}: ${e.response.data.error.message}`);
//     });