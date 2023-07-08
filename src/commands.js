async function request(messages) {
    return await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      // temperature: 0.6,
    });
  };

const prompt = (context) => async function(args, options) {
    console.log("prompt mode");
    console.log("\targs:", args);
    console.log("\topts:", options);
    // TODO
}

const question = (context) => async function(args, options) {
    console.log("question mode");
    console.log("\targs:", args);
    console.log("\topts:", options);
    // TODO
    console.log(context.messages);
    // const response = await request();
}

const interactive = (context) => async function(args, options) {
    console.log("interactive mode");
    console.log("\targs:", args);
    console.log("\topts:", options);
    // TODO
}

export {
    prompt,
    question,
    interactive,
}
