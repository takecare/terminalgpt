import { UserMessage } from "./context.js";
import { request } from "./gpt.js";

const prompt = (context) =>
  async function (options) {
    console.log("prompt mode");
    console.log("\topts:", options);
    // TODO input for user to type their question
    // TODO issue request
    // TODO display response
  };

const question = (context) =>
  async function (question, options) {
    console.log("question mode");
    console.log("\tquestion:", question);
    console.log("\topts:", options);
    // TODO deal with possibility of args being an array of str
    // context.add(new UserMessage(args));
    context.add(new UserMessage(question[0]));
    const response = await request(context);
    // TODO how to deal with erroneous responses?
    const message = response.data.choices[0].message;
    const content = message.content;
    console.log(content);
  };

const interactive = (context) =>
  // TODO do we want to accept args here or just options? we could accept an
  // optional question to kickstart the interactive session
  async function (args, options) {
    console.log("interactive mode");
    console.log("\targs:", args);
    console.log("\topts:", options);
    // TODO
  };

export { prompt, question, interactive };
