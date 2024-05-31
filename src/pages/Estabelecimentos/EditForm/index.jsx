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
//import SelectComponent from "src/components/Select";
import TextFieldComponent from "src/components/TextField";
import { api, routes } from "src/services/api";

import LinearLoader from "src/components/LinearProgress";

import extractErrorDetails from "src/utils/extractErrorDetails";


function EditFormEstabelecimento() {
  const [estabelecimento, setEstabelecimento] = useState({});
  const [loading, setLoading] = useState;

  const navigate = useNavigate();
  const { id } = useParams();
  const { createModal } = useModal();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`${routes.estabelecimentos}${id}/`);
      setEstabelecimento(data || {});
    } catch (e) {
      setEstabelecimento(initialValue);
      createModal({
        id: "confirm-get-erro-modal",
        Component: ModalError,
        props: {
          id: "confirm-get-erro",
          title: "Erro",
          message: "Ops, aconteceu algum erro ao buscar o estabelecimento",
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
    setValue,
  } = useForm<FormState>({
    mode: "all",
  });

  const editarEstabelecimento = useCallback(async () => {
    try {
      await api.put(`${routes.estabelecimentos}${id}/`, estabelecimento);
      createModal({
        id: "estabelecimento-modal",
        Component: ModalSuccess,
        props: {
          id: "confirm-save-success",
          title: "Sucesso",
          message: "Estabelecimento editado com sucesso",
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
      if (name === "status") {
        setValue("status", value, { shouldValidate: true });
      }
    },
    [setValue]
  );

  if (loading) {
    return <LinearLoader loading={loading} />;
  }

  return (
    <Card>
      <CardHeader title="Estabelecimentos" subheader="Editar Estabelecimento" />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextFieldComponent
              variant="outlined"
              label="Nome"
              placeholder="Nome do Estabelecimento"
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
          </Grid>
          {/* <Grid item xs={4}>
            <SelectComponent
              fullWidth
              label="Status"
              value={estabelecimento.status}
              defaultValue={estabelecimento.status}
              {...register("status", {
                required: { value: true, message: "Campo obrigatório" },
              })}
              onChange={onChangeField("status")}
              options={[
                {
                  value: "",
                  label: <em>Selecione uma opção</em>,
                  disabled: true,
                },
                { value: "true", label: "Ativo" },
                { value: "false", label: "Inativo" },
              ]}
              erro={errors?.status?.message}
            />
          </Grid> */}
          <Grid item xs={4}>
            <TextFieldComponent
              variant="outlined"
              label="Descrição"
              placeholder="Digite uma Descrição"
              margin="normal"
              error={!!errors?.description}
              helperText={errors?.description?.message}
              inputProps={{ maxLength: 50 }}
              {...register("description", {
                minLength: {
                  value: 2,
                  message: "No minimo 2 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "No máximo 50 caracteres",
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
            onClick={handleSubmit(editarEstabelecimento)}
            className="botao-enviar">
            Editar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default EditFormEstabelecimento;
