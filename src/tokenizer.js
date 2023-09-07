import { encode } from "gpt-3-encoder";

// function countTokens(context) {
//   let message;
//   let count = 0;
//   for (message of context.messages) {
//     const encoded = encode(message.content);
//     count += encoded.length;
//   }
//   return count;
// }

function countTokens(messages) {
  let message;
  let count = 0;
  for (message of messages) {
    const encoded = encode(message);
    count += encoded.length;
  }
  return count;
}

export { countTokens };
