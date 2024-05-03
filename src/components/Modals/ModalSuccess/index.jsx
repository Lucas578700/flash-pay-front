import Button from "@mui/material/Button";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useCallback } from "react";
import Modal from "../Modal";
import { Container, MainText, HeaderText } from "./styles";


function ModalSuccess({
  id,
  open,
  handleClose,
  message = "Sucesso",
  title = "Sucesso",
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
          <CheckCircleOutlineIcon
            style={{ marginLeft: 10, fontSize: "3rem" }}
          />
          {title}
        </HeaderText>
      }
      escape={false}
      maxWidth="xs"
      type="success"
      FooterComponent={ButtonRender}>
      <Container>{message && <MainText>{message}</MainText>}</Container>
    </Modal>
  );
}

export default ModalSuccess;
