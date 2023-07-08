import { Configuration, OpenAIApi } from 'openai';
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

// async function request(messages) {
async function request(context) {
  return await openai.createChatCompletion({
    model: context.model,
    messages: context.messages
    // temperature: 0.6,
  });
}

const prompt = context => async function (options) {
  console.log('prompt mode');
  console.log('\topts:', options);
  // TODO input for user to type their question
  // TODO issue request
  // TODO display response
};

const question = context => async function (question, options) {
  console.log('question mode');
  console.log('\tquestion:', question);
  console.log('\topts:', options);
  // TODO deal with possibility of args being an array of str
  // context.add(new UserMessage(args));
  // TODO
  // const response = await request();
};

const interactive = context =>
// TODO do we want to accept args here or just options? we could accept an
// optional question to kickstart the interactive session
async function (args, options) {
  console.log('interactive mode');
  console.log('\targs:', args);
  console.log('\topts:', options);
  // TODO
};

export { prompt, question, interactive };