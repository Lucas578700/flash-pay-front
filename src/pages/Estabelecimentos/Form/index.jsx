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
  image: "",
  description: "",
};

function FormEstabelecimento() {
  const [estabelecimento, setEstabelecimento] = useState(initialValue);
  const navigate = useNavigate();
  const { createModal } = useModal();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
  });

  const adicionarEstabelecimento = useCallback(async () => {
    try {
      const { cnpj, ...estabelecimentoChange } = estabelecimento;
      await api.post(routes.shoppe, {
        ...estabelecimentoChange,
        cnpj: cnpj.replace(/\D/g, ""),
      });
      createModal({
        id: "estabelecimento-modal",
        Component: ModalSuccess,
        props: {
          id: "confirm-save-success",
          title: "Sucesso",
          message: "Estabelecimento cadastrado com sucesso",
          textConfirmButton: "Ok",
          onClose: () => navigate("/painel/estabelecimento"),
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
      }, [createModal, navigate, estabelecimento]);

  const onChangeField = useCallback(
    (name) => (e) => {
      const { value } = e.target;
      setEstabelecimento(prevEstabelecimento => ({
        ...prevEstabelecimento,
        [name]: value,
      }));
    },
    []
  );

  return (
    <Card>
      <CardHeader title="Estabelecimentos" subheader="Cadastrar Estabelecimento" />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextFieldComponent
              variant="outlined"
              label="Nome"
              placeholder="Nome do Estabelecimento"
              margin="normal"
              required
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
                value: estabelecimento.name,
                onChange: onChangeField("name"),
              })}
            />
          </Grid>
          <Grid item xs={4}>
            <TextFieldComponent
              variant="outlined"
              label="CNPJ"
              placeholder="Digite o CNPJ"
              margin="normal"
              type="number"
              required
              error={!!errors?.cnpj}
              helperText={errors?.cnpj?.message}
              inputProps={{ maxLength: 50 }}
              value={cpfCnpjMask(estabelecimento.cnpj)}
              {...register("cnpj", {
                required: { value: true, message: "Campo obrigatório" },
                max: {
                  value: 50,
                  message: "No máximo 50 itens",
                },
                min: {
                  value: 1,
                  message: "Campo obrigatório",
                },
                value: estabelecimento.cnpj,
                onChange: onChangeField("cnpj"),
              })}
            />
          </Grid>

          {/* <Grid item xs={4}>
            <TextFieldComponent
              variant="outlined"
              label="Imagem"
              placeholder="Adicione uma imagem"
              margin="normal"
              type="number"
              required
              error={!!errors?.cnpj}
              helperText={errors?.cnpj?.message}
              inputProps={{ maxLength: 3 }}
              {...register("cnpj", {
                required: { value: true, message: "Campo obrigatório" },
                max: {
                  value: 999,
                  message: "No máximo 999 itens",
                },
                min: {
                  value: 1,
                  message: "Campo obrigatório",
                },
                value: estabelecimento.cnpj,
                onChange: onChangeField("cnpj"),
              })}
            />
          </Grid> */}

<Grid item xs={4}>
            <TextFieldComponent
              variant="outlined"
              label="Descrição"
              placeholder="Digite a descrição"
              margin="normal"
              type="text"
              error={!!errors?.description}
              helperText={errors?.description?.message}
              inputProps={{ maxLength: 999 }}
              {...register("description", {
                required: { value: true, message: "Campo obrigatório" },
                max: {
                  value: 999,
                  message: "No máximo 999 itens",
                },
                min: {
                  value: 1,
                  message: "Campo obrigatório",
                },
                value: estabelecimento.description,
                onChange: onChangeField("description"),
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
            onClick={handleSubmit(adicionarEstabelecimento)}
            className="botao-enviar">
            Cadastrar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default FormEstabelecimento;
