import { Configuration, OpenAIApi } from "openai";
import "dotenv/config"; // load .env file into process.env

const DEFAULT_MODEL = "gpt-3.5-turbo";

export { DEFAULT_MODEL };

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// https://github.com/openai/openai-node
const openai = new OpenAIApi(configuration);

async function request(model, messages) {
  const apiMessages = messages.map(m => m.message);
  try {
    return await openai.createChatCompletion({
      model,
      messages: apiMessages,
      // temperature: 0.6,
    });
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
    throw Error("");
  }
}

// leaving this here as a quick doc on what composes the openai response object
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

async function fakeRequest(model, messages, fails = false) {
  const contents = messages
    .map((m) => `'${m.message.role}:${m.message.content}'`)
    .reduce((p, c) => `${p}, ${c}`);
  const response = {
    data: {
      choices: [
        {
          message: {
            content: `${model} response for "${contents}"`,
          },
        },
      ],
    },
  };
  const promise = new Promise((resolve, reject) => {
    setTimeout(
      () => (fails ? reject(Error("boom!")) : resolve(response)),
      1200
    );
  });
  return promise;
}

export { request, fakeRequest };
