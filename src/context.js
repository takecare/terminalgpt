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

class Context {
  #messages;
  model;
  mode;

  constructor() {
    // TODO custom initial system/context message
    this.#messages = [new ContextMessage("You are a helpful assistant.")];
    this.model = DEFAULT_MODEL;
    this.mode = "question";
  }

  add(message) {
    this.#messages.push(message);
  }

  get messages() {
    return this.#messages;
  }
}

export { Message, UserMessage, AssistantMessage, Context };
