import { createContext } from "react";

const APIErrorContext = createContext({
  error: null,
  addError: () => {},
  removeError: () => {},
});

export default APIErrorContext;
