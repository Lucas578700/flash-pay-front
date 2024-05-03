import Button from "@mui/material/Button";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useCallback } from "react";
import Modal from "../Modal";
import { Container, MainText, HeaderText } from "./styles";

function MessageModal({
  id,
  open,
  handleClose,
  message,
  title,
  textConfirmButton = "Fechar",
  onClose = () => null,
}) {
  const ButtonRender = useCallback(() => {
    return (
      <Button
        id="ok-message-"
        variant="contained"
        onClick={() => {
          handleClose();
          onClose();
        }}
        style={{ minWidth: 100, marginTop: 10 }}>
        {textConfirmButton}
      </Button>
    );
  }, [handleClose, onClose, textConfirmButton]);
  return (
    <Modal
      id={id}
      open={open}
      title={
        <HeaderText>
          <CancelOutlinedIcon style={{ marginLeft: 10, fontSize: "3rem" }} />
          {title}
        </HeaderText>
      }
      escape={false}
      maxWidth="xs"
      type="error"
      FooterComponent={ButtonRender}>
      <Container>{message && <MainText>{message}</MainText>}</Container>
    </Modal>
  );
}

export default MessageModal;
