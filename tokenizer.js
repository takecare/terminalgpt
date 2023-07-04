// tokenizer

const { encode, decode } = require("gpt-3-encoder");

function countTokens(message) {
    const encoded = encode(message.content);
    return encoded.length;
}

module.exports = {
    countTokens,
};
