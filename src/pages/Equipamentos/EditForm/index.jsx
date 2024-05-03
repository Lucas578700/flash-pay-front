/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/label-has-associated-control */
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
import SelectComponent from "src/components/Select";
import TextFieldComponent from "src/components/TextField";
import { api, routes } from "src/services/api";

import LinearLoader from "src/components/LinearProgress";

import extractErrorDetails from "src/utils/extractErrorDetails";


function EditFormEquipamento() {
  const [equipamento, setEquipamento] = useState({});
  const [loading, setLoading] = useState;

  const navigate = useNavigate();
  const { id } = useParams();
  const { createModal } = useModal();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`${routes.equipamentos}${id}/`);
      setEquipamento(data || {});
    } catch (e) {
      setEquipamento(initialValue);
      createModal({
        id: "confirm-get-erro-modal",
        Component: ModalError,
        props: {
          id: "confirm-get-erro",
          title: "Erro",
          message: "Ops, aconteceu algum erro ao buscar o equipamento",
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

  const editarEquipamento = useCallback(async () => {
    try {
      await api.put(`${routes.equipamentos}${id}/`, equipamento);
      createModal({
        id: "equipamento-modal",
        Component: ModalSuccess,
        props: {
          id: "confirm-save-success",
          title: "Sucesso",
          message: "Equipamento editado com sucesso",
          textConfirmButton: "Ok",
          onClose: () => navigate("/painel/equipamento"),
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
  }, [createModal, navigate, equipamento]);

  const onChangeField = useCallback(
    (name) => (e) => {
      const { value } = e.target;
      setEquipamento(prevEquipamento => ({
        ...prevEquipamento,
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
      <CardHeader title="Equipamentos" subheader="Editar Equipamento" />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextFieldComponent
              variant="outlined"
              label="Nome"
              placeholder="Nome do Equipamento"
              margin="normal"
              error={!!errors?.nome}
              helperText={errors?.nome?.message}
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
                value: equipamento.nome,
                onChange: onChangeField("nome"),
              })}
            />
          </Grid>
          <Grid item xs={4}>
            <TextFieldComponent
              variant="outlined"
              label="Quantidade"
              placeholder="Quantidade do Equipamento"
              margin="normal"
              type="number"
              error={!!errors?.quantidade}
              helperText={errors?.quantidade?.message}
              inputProps={{ maxLength: 3 }}
              {...register("quantidade", {
                required: { value: true, message: "Campo obrigatório" },
                max: {
                  value: 999,
                  message: "No máximo 999 itens",
                },
                min: {
                  value: 1,
                  message: "Campo obrigatório",
                },
                value: equipamento.quantidade,
                onChange: onChangeField("quantidade"),
              })}
            />
          </Grid>
          <Grid item xs={4}>
            <SelectComponent
              fullWidth
              label="Status"
              value={equipamento.status}
              defaultValue={equipamento.status}
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
            onClick={handleSubmit(editarEquipamento)}
            className="botao-enviar">
            Editar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default EditFormEquipamento;
