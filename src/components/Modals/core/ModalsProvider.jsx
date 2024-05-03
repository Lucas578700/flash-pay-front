import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
} from "react";

import map from "lodash/map";

import {
  CREATE_MODAL,
  CLOSE_MODAL,
  REMOVE_MODAL,
  RESET_MODALS,
  modalsReducer,
} from "./modalsReducer";

const ModalsContext = createContext({});
export const useModal = () => useContext(ModalsContext);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function GenericComponent({ children }) {
  return children || null;
}

function ModalsProvider(props) {
  const { ContainerComponent = GenericComponent, children } = props;

  const [modals, dispatch] = useReducer(modalsReducer, []);

  const createModal = useCallback(
    (modal) => dispatch({ type: CREATE_MODAL, modal }),
    []
  );

  const removeModal = useCallback(
    (modal, immediately = false) => {
      if (immediately) {
        dispatch({ type: REMOVE_MODAL, modal });
      } else {
        dispatch({ type: CLOSE_MODAL, modal });
        setTimeout(() => {
          dispatch({ type: REMOVE_MODAL, modal });
        }, 300);
      }
    },
    []
  );

  const resetModals = useCallback(
    () => dispatch({ type: RESET_MODALS }),
    []
  );

  const state = useMemo(
    () => ({
      createModal,
      removeModal,
      resetModals,
      modals,
    }),
    [createModal, modals, removeModal, resetModals]
  );

  const renderedModals = useMemo(
    () =>
      map(modals, modal => {
        const { id, open, Component, props: modalProps = {} } = modal;

        return (
          <Component
            key={id}
            id={id}
            handleClose={() => removeModal({ id })}
            open={open ?? false}
            {...modalProps}
          />
        );
      }),
    [modals, removeModal]
  );

  return (
    <ModalsContext.Provider value={state}>
      {children}

      <ContainerComponent>{renderedModals}</ContainerComponent>
    </ModalsContext.Provider>
  );
}

export default ModalsProvider;
