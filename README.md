# TerminalGPT

A simple terminal tool to use OpenAPI's chat models from your terminal.

## TODO

### Testing

- https://github.com/vadimdemedes/ink?tab=readme-ov-file#testing
- https://github.com/vadimdemedes/ink/blob/master/examples/jest

### Token Count

- 🦟 Bug: token count is not updated when answer is received/displayed
- Can we place the token estimation better so that in a long (interactive)
conversation it just doesn't disappear?
- Update the token count with the effective count we get back from the API

### Stream

- Stream answer

### Error Handling

- Error handling (eg. what happens if the request fails?)

### Navigation

- Up & Down arrow text navigation
- Shortcut to copy answer
  - Interactive mode: pressing META+ALT+C to copy the latest answer
