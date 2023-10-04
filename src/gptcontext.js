import { DEFAULT_MODEL } from "./gpt.js";

class Message {
  #role;
  #content;

  constructor(role, content) {
    this.#role = role;
    this.#content = content;
  }

  get role() {
    return this.#role;
  }

  get content() {
    return this.#content;
  }

  get message() {
    return { role: this.#role, content: this.#content };
  }

  toString() {
    return `{ role: ${this.#role}, content: ${this.#content} }`;
  }
}

class ContextMessage extends Message {
  constructor(content) {
    super("system", content);
  }
}

class UserMessage extends Message {
  constructor(content) {
    super("user", content);
  }
}

class AssistantMessage extends Message {
  constructor(content) {
    super("assistant", content);
  }
}

export { Message, UserMessage, AssistantMessage };
