class Mode {
  static #_PROMPT = "PROMPT";
  static #_QUESTION = "QUESTION";
  static #_INTERACTIVE = "INTERACTIVE";

  static get PROMPT() {
    return this.#_PROMPT;
  }

  static get QUESTION() {
    return this.#_QUESTION;
  }

  static get INTERACTIVE() {
    return this.#_INTERACTIVE;
  }

  static values() {
    return Object.entries(Object.getOwnPropertyDescriptors(Mode))
      .filter((e) => e[1].get)
      .map((e) => e[0]);
  }
}

export default Mode;
