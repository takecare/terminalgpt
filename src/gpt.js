import { Configuration, OpenAIApi } from "openai";
import "dotenv/config"; // load .env file into process.env

const DEFAULT_MODEL = "gpt-3.5-turbo";

export { DEFAULT_MODEL };

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// async function request(messages) {
async function request(context) {
  console.log(context.messages);
  return await openai.createChatCompletion({
    model: context.model,
    messages: context.messages,
    // temperature: 0.6,
  });
}

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
