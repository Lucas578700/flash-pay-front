import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { ModalError, ModalSuccess, useModal } from "src/components/Modals";
import TextFieldComponent from "src/components/TextField";
import { api, routes } from "src/services/api";

import LinearLoader from "src/components/LinearProgres";

import extractErrorDetails from "src/utils/extractErrorDetails";

const initialValue = {
  name: "",
};

function EditFormCategory() {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const { createModal } = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm({
    mode: "all",
    defaultValues: initialValue,
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`${routes.category}${id}/`);
      reset(data);
    } catch (e) {
      reset(initialValue);
      createModal({
        id: "confirm-get-erro-modal",
        Component: ModalError,
        props: {
          id: "confirm-get-erro",
          title: "Erro",
          message: "Ops, aconteceu algum erro ao buscar a categoria",
          textConfirmButton: "Ok",
        },
      });
    } finally {
      setLoading(false);
    }
  }, [createModal, ModalError]);

  useEffect(() => {
    fetchData();
  }, []);

  const editarCategoria = useCallback(async () => {
    try {
      const values = getValues();
      await api.put(`${routes.category}${id}/`, values);
      createModal({
        id: "categoria-modal",
        Component: ModalSuccess,
        props: {
          id: "confirm-save-success",
          title: "Sucesso",
          message: "Categoria editada com sucesso",
          textConfirmButton: "Ok",
          onClose: () => navigate("/painel/categoria"),
        },
      });
    } catch (e) {
      console.log(e);
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
  }, [createModal, navigate]);

  if (loading) {
    return <LinearLoader loading={loading} />;
  }

  return (
    <Card>
      <CardHeader title="Categorias" subheader="Editar Categoria" />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextFieldComponent
              variant="outlined"
              label="Nome"
              placeholder="Nome da Categoria"
              margin="normal"
              error={!!errors?.name}
              helperText={errors?.name?.message}
              inputProps={{ maxLength: 50 }}
              {...register("name", {
                required: { value: true, message: "Campo obrigatório" },
                minLength: {
                  value: 2,
                  message: "No minimo 2 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "No máximo 50 caracteres",
                },
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
            onClick={handleSubmit(editarCategoria)}
            className="botao-enviar">
            Editar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default EditFormCategory;
