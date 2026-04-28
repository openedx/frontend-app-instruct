class EditorView {
  constructor() {
    this.destroy = jest.fn();
  }
}

const EditorState = {
  create: jest.fn(),
  readOnly: {
    of: jest.fn(),
  },
};

const basicSetup = [];

module.exports = {
  EditorView,
  EditorState,
  basicSetup,
};
