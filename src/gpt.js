import { Configuration, OpenAIApi } from "openai";
import "dotenv/config"; // load .env file into process.env

const DEFAULT_MODEL = "gpt-3.5-turbo";

export { DEFAULT_MODEL };

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function request(context) {
  return await openai.createChatCompletion({
    model: context.model,
    messages: context.messages,
    // temperature: 0.6,
  });
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

async function fakeRequest() {
  const response = {
    data: {
      choices: [
        {
          message: {
            content: "this is the response... ",
          },
        },
      ],
    },
  };
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(response), 1200);
  });
  return promise;
}

export { request, fakeRequest };
