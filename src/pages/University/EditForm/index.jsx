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

import LinearLoader from "src/components/LinearProgress";

import extractErrorDetails from "src/utils/extractErrorDetails";
import { cpfCnpjMask } from "src/functions/CnpjMask";

const initialValue = {
  name: "",
  cnpj: "",
};

function EditFormUniversity() {
  const [universidade, setUniversidade] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const { createModal } = useModal();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`${routes.university}${id}/`);
      setUniversidade(data || {});
    } catch (e) {
      setUniversidade(initialValue);
      createModal({
        id: "confirm-get-erro-modal",
        Component: ModalError,
        props: {
          id: "confirm-get-erro",
          title: "Erro",
          message: "Ops, aconteceu algum erro ao buscar a universidade",
          textConfirmButton: "Ok",
        },
      });
    } finally {
      setLoading(false);
    }
  }, [createModal]);

  useEffect(() => {
    fetchData();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
  });

  const editarUniversidade = useCallback(async () => {
    try {
      const { cnpj, ...universidadeChange } = universidade;
      await api.post(routes.university, {
        ...universidadeChange,
        cnpj: cnpj.replace(/\D/g, ""),
      });
      await api.put(`${routes.university}${id}/`, universidade);
      createModal({
        id: "universidade-modal",
        Component: ModalSuccess,
        props: {
          id: "confirm-save-success",
          title: "Sucesso",
          message: "Universidade editada com sucesso",
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
      setUniversidade(prevUniversidade => ({
        ...prevUniversidade,
        [name]: value,
      }));
    },
    [setUniversidade]
  );

  if (loading) {
    return <LinearLoader loading={loading} />;
  }

  return (
    <Card>
      <CardHeader title="Universidades" subheader="Editar Universidade" />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextFieldComponent
              variant="outlined"
              label="Nome"
              placeholder="Nome da Universidade"
              margin="normal"
              error={!!errors?.name}
              helperText={errors?.name?.message}
              inputProps={{ maxLength: 50 }}
              value={universidade.name}
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
              error={!!errors?.cnpj}
              helperText={errors?.cnpj?.message}
              inputProps={{ maxLength: 50 }}
              value={cpfCnpjMask(universidade.cnpj)}
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
            onClick={handleSubmit(editarUniversidade)}
            className="botao-enviar">
            Editar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default EditFormUniversity;
