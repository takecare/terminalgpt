import { UserMessage } from "./context.js";

const prompt = (context, callback) =>
  async function (options) {
    callback(context);
  };

const question = (context, callback) =>
  async function (question, options) {
    // TODO deal with possibility of args being an array of str
    // TODO how to deal with erroneous responses?

    context.add(new UserMessage(question[0]));
    callback(context);

    // const response = await fakeRequest(context);
    // const message = response.data.choices[0].message;
    // const content = message.content;
    // console.log(content);
  };

const interactive = (context, callback) =>
  // TODO do we want to accept args here or just options? we could accept an
  // optional question to kickstart the interactive session
  async function (args, options) {
    callback(context);
  };

export { prompt, question, interactive };
