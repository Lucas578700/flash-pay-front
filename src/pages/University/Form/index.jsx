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
import { cpfCnpjMask } from "src/functions/CnpjMask";

import extractErrorDetails from "src/utils/extractErrorDetails";
const initialValue = {
  name: "",
  cnpj: "",
};
function FormUniversity() {
  const [universidade, setUniversity] = useState(initialValue);
  const navigate = useNavigate();
  const { createModal } = useModal();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
  });

  const adicionarUniversity = useCallback(async () => {
    try {
      const { cnpj, ...universidadeChange } = universidade;
      await api.post(routes.university, {
        ...universidadeChange,
        cnpj: cnpj.replace(/\D/g, ""),
      });
      createModal({
        id: "universidade-modal",
        Component: ModalSuccess,
        props: {
          id: "confirm-save-success",
          title: "Sucesso",
          message: "Universidade cadastrada com sucesso",
          textConfirmButton: "Ok",
          onClose: () => navigate("/painel/universidade"),
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
  }, [createModal, navigate, universidade]);

  const onChangeField = useCallback(
    name => e => {
      const { value } = e.target;
      setUniversity(prevUniversity => ({
        ...prevUniversity,
        [name]: value,
      }));
    },
    []
  );

  return (
    <Card>
      <CardHeader title="Universidades" subheader="Cadastrar Universidade" />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextFieldComponent
              variant="outlined"
              label="Nome da Universidade"
              placeholder="Nome do Universidade"
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
                value: universidade.name,
                onChange: onChangeField("name"),
              })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextFieldComponent
              variant="outlined"
              label="CNPJ"
              placeholder="CNPJ"
              margin="normal"
              required
              error={!!errors?.cnpj}
              helperText={errors?.cnpj?.message}
              inputProps={{ maxLength: 50 }}
              value={cpfCnpjMask(universidade.cnpj)}
              {...register("cnpj", {
                required: { value: true, message: "Campo obrigatório" },
                max: {
                  value: 50,
                  message: "No máximo 50 digítos",
                },
                min: {
                  value: 1,
                  message: "Campo obrigatório",
                },
                value: universidade.cnpj,
                onChange: onChangeField("cnpj"),
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
            onClick={handleSubmit(adicionarUniversity)}
            className="botao-enviar">
            Cadastrar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default FormUniversity;
