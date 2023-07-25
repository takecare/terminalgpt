import { UserMessage } from "./context.js";

// commands now do very little as we shift the logic from them to components.
// from this module we provide what are essentially command factories. each
// factory requires the context object and a callback that is to be called once
// any setup required for the specific command is done.
// for example, for the question command we add an initial message to provide
// more context to the model

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
  };

const interactive = (context, callback) =>
  // TODO do we want to accept args here or just options? we could accept an
  // optional question to kickstart the interactive session
  async function (args, options) {
    callback(context);
  };

export { prompt, question, interactive };
