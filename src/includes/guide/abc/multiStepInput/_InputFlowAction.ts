class InputFlowAction extends Error {
  static back = new InputFlowAction();
  static cancel = new InputFlowAction();
  static resume = new InputFlowAction();
}

export { InputFlowAction };
