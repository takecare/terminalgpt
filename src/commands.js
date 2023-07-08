async function request(messages) {
    return await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      // temperature: 0.6,
    });
  };

function prompt(args, options) {
    console.log("prompt mode");
    console.log("\targs:", args);
    console.log("\topts:", options);
    // TODO
}

async function question(args, options) {
    console.log("question mode");
    console.log("\targs:", args);
    console.log("\topts:", options);
    // TODO
}

function interactive(args, options) {
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
