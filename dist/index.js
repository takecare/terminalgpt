#!/usr/bin/env NODE_NO_WARNINGS=1 node --loader=import-jsx
// https://github.com/vadimdemedes/import-jsx ⤴
import { Configuration, OpenAIApi } from "openai";
import { Command } from "commander";
import { countTokens } from "./tokenizer.js";
import { Context, UserMessage } from "./context.js";
import { question, prompt, interactive } from "./commands.js";
import React from 'react';
import { render } from 'ink';
import { Demo } from "./tui.js";
import "dotenv/config"; // load .env file into process.env

if (!process.env.OPENAI_API_KEY) {
  console.error("No OpenAI API key found. Please set it via OPENAI_API_KEY.");
  process.exit(1);
}
const DEFAULT_MODEL = "x";
const program = new Command();
program.name("TerminalGPT").description("CLI tool to interact with the OpenAI API.").version("0.0.1");
program.option("-m, --model <model>", "Define the model you're interacting with.", DEFAULT_MODEL);
program.command("question").alias("q").description("Ask a single (one-shot) question to one of OpenAI's models.").argument("<question>", "The question to ask.").action(question);
program.command("prompt").alias("p").description("...").action(prompt);
program.command("interactive").alias("i").description("...").action(interactive);
program.command("default", {
  hidden: true,
  isDefault: true
}).action((str, options) => {
  if (program.args.length == 0) {
    interactive(program.args, program.opts());
  } else if (program.args.length > 0) {
    question(program.args, program.opts());
  }
});
program.parse();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);
const context = new Context();
context.add(new UserMessage("who are you?"));
render( /*#__PURE__*/React.createElement(Demo, null));

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