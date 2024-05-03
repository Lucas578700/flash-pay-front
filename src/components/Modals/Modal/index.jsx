import {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Draggable from "react-draggable";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import { useModal } from "..";

import HeaderTitleClose from "./HeaderTitleClose";
import LinearLoader from "../../LinearProgress";

function Modal({
  draggable = true,
  children,
  id,
  open,
  escape = false,
  loading = false,
  title,
  subTitle,
  onClose,
  onConfirm,
  textConfirmButton = "Confirmar",
  FooterComponent,
  position = "center",
  headerProps = {},
  fullScreen = false,
  disableFullScreen = true,
  maxWidth = "sm",
  hideHeader = false,
  escapeWhenLoading = false,
  contentContainerStyle = {},
  footerContainerStyle = {},
  type = "info",
  ...rest
}) {
  const [fullScreenState, setFullScreenState] = useState(fullScreen);

  const canEscape = useMemo(
    () => escape && (escapeWhenLoading || !loading),
    [escape, escapeWhenLoading, loading]
  );

  useEffect(() => {
    setFullScreenState(fullScreen);
  }, [fullScreen]);

  const { removeModal } = useModal();

  const handleClose = useCallback(
    (reason) => {
      if (
        !canEscape &&
        (reason === "backdropClick" || reason === "escapeKeyDown")
      ) {
        return false;
      }
      removeModal({ id });
      return onClose ? onClose() : false;
    },
    [canEscape, id, onClose, removeModal]
  );

  const handleConfirm = useCallback(() => {
    if (onConfirm) {
      onConfirm();
    }
    handleClose("backdropClick");
  }, [handleClose, onConfirm]);

  const DraggablePaper = useCallback(
    (paperProps) => (
      <Draggable
        handle={`#header-${id}`}
        cancel={'[class*="MuiDialogContent-root"]'}>
        <Paper {...paperProps} />
      </Draggable>
    ),
    [id]
  );

  const componentsProps = useMemo(
    () => ({
      onClose: handleClose,
      title,
      subTitle,
      escape: canEscape,
    }),
    [canEscape, handleClose, subTitle, title]
  );

  return (
    <Dialog
      id={id}
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown={!canEscape}
      disableRestoreFocus
      disableEnforceFocus
      maxWidth={maxWidth}
      fullScreen={fullScreenState}
      PaperComponent={draggable ? DraggablePaper : undefined}
      fullWidth
      {...rest}>
      {!hideHeader && (
        <HeaderTitleClose
          id={id}
          color="primary"
          draggable={draggable}
          fullScreen={fullScreenState}
          onChangeFullScreen={() => setFullScreenState(old => !old)}
          fullScreenButton={!disableFullScreen}
          {...componentsProps}
          {...headerProps}
        />
      )}

      <DialogContent style={contentContainerStyle} dividers>
        {children}
      </DialogContent>

      {FooterComponent && (
        <DialogActions style={footerContainerStyle}>
          <FooterComponent {...componentsProps} />
        </DialogActions>
      )}

      {onConfirm && (
        <DialogActions>
          <Button color="primary" onClick={handleConfirm}>
            {textConfirmButton}
          </Button>
        </DialogActions>
      )}

      {loading !== undefined && <LinearLoader loading={loading ? "true": "false"} value={0} />}
    </Dialog>
  );
}

export default Modal;
