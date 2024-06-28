import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
} from "@mui/material";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ModalError, ModalSuccess, useModal } from "src/components/Modals";
import TextFieldComponent from "src/components/TextField";
import { api, routes } from "src/services/api";

import extractErrorDetails from "src/utils/extractErrorDetails";
const initialValue = {
  name: "",
};
function FormCategory() {
  const [categoria, setCategoria] = useState(initialValue);
  const navigate = useNavigate();
  const { createModal } = useModal();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
  });

  const adicionarCategory = useCallback(async () => {
    try {
      await api.post(routes.category, categoria);
      createModal({
        id: "universidade-modal",
        Component: ModalSuccess,
        props: {
          id: "confirm-save-success",
          title: "Sucesso",
          message: "Categoria cadastrada com sucesso",
          textConfirmButton: "Ok",
          onClose: () => navigate("/painel/categoria"),
        },
      });
    } catch (e) {
      const dataModal = {
        titulo: "Erro ao salvar",
        mensagem: extractErrorDetails(e),
      };

      createModal({
        id: "confirm-save-erro-modal",
        Component: ModalError,
        props: {
          id: "confirm-save-erro",
          title: dataModal.titulo,
          message: dataModal.mensagem,
          textConfirmButton: "Ok",
        },
      });
    }
  }, [createModal, navigate, categoria]);

  const onChangeField = useCallback(
    name => e => {
      const { value } = e.target;
      setCategoria(prevCategory => ({
        ...prevCategory,
        [name]: value,
      }));
    },
    []
  );

  return (
    <Card>
      <CardHeader title="Categorias" subheader="Cadastrar Categoria" />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextFieldComponent
              variant="outlined"
              label="Nome da Categoria"
              placeholder="Nome do Categoria"
              margin="normal"
              required
              error={!!errors?.name}
              helperText={errors?.name?.message}
              inputProps={{ maxLength: 50 }}
              {...register("nome", {
                required: { value: true, message: "Campo obrigatório" },
                minLength: {
                  value: 2,
                  message: "No minimo 2 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "No máximo 50 caracteres",
                },
                value: categoria.name,
                onChange: onChangeField("name"),
              })}
            />
          </Grid>
        </Grid>
        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
          }}>
          <Button
            variant="contained"
            onClick={handleSubmit(adicionarCategory)}
            className="botao-enviar">
            Cadastrar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default FormCategory;
