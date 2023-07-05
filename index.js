const { Configuration, OpenAIApi } = require("openai");
const { Command } = require("commander");

const { countTokens } = require("./tokenizer");
const { Context, UserMessage, Message } = require("./context");

require("dotenv").config(); // load .env file into process.env

if (!process.env.OPENAI_API_KEY) {
  console.error("No OpenAI API key found. Please set it via OPENAI_API_KEY.");
  process.exit(1);
}

const DEFAULT_MODEL = "x";

const program = new Command();

program
  .name("TerminalGPT")
  .description("CLI tool to interact with the OpenAI API.")
  .version("0.0.1");

program
  .option(
    "-m, --model <model>",
    "Define the model you're interacting with.",
    DEFAULT_MODEL,
  );

program
  .command("question")
  .alias("q")
  .description("Ask a single (one-shot) question to one of OpenAI's models.")
  .argument("<question>", "The question to ask.")
  .action((str, options) => {
    //
  });

program
  .command("prompt")
  .alias("p")
  .description("...")
  .action((str, options) => {
    //
  });

program
  .command("interactive")
  .alias("i")
  .description("...")
  .action((str, options) => {
    //
  });

program
  .command("default", { hidden: true, isDefault: true })
  .action((str, options) => {
    if (program.args.length == 0) {
      console.log("default to interactive mode");
    } else if (program.args.length > 0) {
      console.log("default to question mode");
    }
  });

program.parse();

console.log(program.args);
console.log(program.opts());


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


const request = async (messages) => {
  return await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
    // temperature: 0.6,
  });
};

const context = new Context();
context.add(new UserMessage("who are you?"));
context.add(new Message("role", "content"));
console.log(countTokens(context));

// const prompt = assistantMessage("You are a helpful assistant");
// messages.push(prompt);
// let count = 0;
// for (message of messages) {
//   count += countTokens(message);
// }
// console.log(`prompt estimated token count: ${count}`);

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
