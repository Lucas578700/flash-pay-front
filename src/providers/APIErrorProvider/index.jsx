import React, { useCallback, useState } from "react";

import APIErrorContext from "src/hooks/APIErrorContext";

const APIErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  const removeError = () => setError(null);

  const addError = (message, status) =>
    setError({ message, status });

  const contextValue = {
    error,
    addError: useCallback((message, status) => addError(message, status), []),
    removeError: useCallback(() => removeError(), []),
  };

  return (
    <APIErrorContext.Provider value={contextValue}>
      {children}
    </APIErrorContext.Provider>
  );
};

export default APIErrorProvider;
