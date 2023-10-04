import { encode } from "gpt-3-encoder";

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
