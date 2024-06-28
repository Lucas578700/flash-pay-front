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
import { cpfCnpjMask } from "src/functions/CnpjMask";

import LinearLoader from "src/components/LinearProgres";

import extractErrorDetails from "src/utils/extractErrorDetails";

const initialValue = {
  name: "",
  cnpj: "",
  image: "",
  description: "",
  university: "",
};

function EditFormEstabelecimento() {
  const [loading, setLoading] = useState(false);
  const [universidades, setUniversidades] = useState([]);
  const [universidade, setUniversidade] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const { createModal } = useModal();

  const [imagemApi, setImage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    mode: "all",
    defaultValues: initialValue,
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [shoppeResponse, univerityResponse] = await Promise.all([
        api.get(`${routes.shoppe}${id}/`),
        api.get(`${routes.university}`),
      ]);

      setUniversidades(univerityResponse.data.results || []);

      const { cnpj, image, university, ...estabelecimentoChange } =
        shoppeResponse.data || {};
      setImage(image);
      reset({
        ...estabelecimentoChange,
        cnpj: cpfCnpjMask(cnpj),
        university: String(university.id),
      });
      setUniversidade(String(university.id));
    } catch (e) {
      reset(initialValue);
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
  }, [createModal, id, reset]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const editarEstabelecimento = useCallback(
    async data => {
      try {
        const { cnpj, image, ...estabelecimentoChange } = data;
        const formData = new FormData();
        formData.append("name", estabelecimentoChange.name);
        formData.append("cnpj", cnpj.replace(/\D/g, ""));
        formData.append("description", estabelecimentoChange.description);
        if (!imagemApi) {
          formData.append("image", image);
        }

        await api.put(`${routes.shoppe}${id}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

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
    },
    [createModal, id, navigate]
  );

  const handleCnpjChange = event => {
    const { value } = event.target;
    setValue("cnpj", cpfCnpjMask(value));
  };

  const handleImage = e => {
    const file = e.target.files[0];
    setImage(null);
    setValue("image", file);
  };

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
                  message: "No mínimo 2 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "No máximo 50 caracteres",
                },
              })}
            />
          </Grid>
          <Grid item xs={4}>
            <TextFieldComponent
              variant="outlined"
              label="CNPJ"
              placeholder="Digite o CNPJ"
              margin="normal"
              error={!!errors?.cnpj}
              helperText={errors?.cnpj?.message}
              inputProps={{ maxLength: 50 }}
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
                onChange: handleCnpjChange,
              })}
            />
          </Grid>
          <Grid item xs={4}>
            <SelectComponent
              fullWidth
              label="Universidade"
              {...register("university", {
                required: { value: true, message: "Campo obrigatório" },
              })}
              value={universidade}
              options={universidades.map(university => ({
                value: `${university.id}`,
                label: university.name,
              }))}
              erro={errors?.university?.message}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <label htmlFor="upload-image">
              <input
                style={{ display: "none" }}
                id="upload-image"
                name="image"
                type="file"
                accept="image/*"
                {...register("image", {
                  onChange: handleImage,
                })}
              />
              <Button color="secondary" variant="contained" component="span">
                Upload Imagem
              </Button>
            </label>
            {imagemApi && (
              <div>
                <img
                  src={`data:image;base64, ${imagemApi}`}
                  alt="Selected"
                  style={{ width: "100%", height: "100%", marginTop: "10px" }}
                />
              </div>
            )}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item md={12} xs={12}>
            <TextFieldComponent
              variant="outlined"
              label="Descrição"
              placeholder="Digite uma Descrição"
              margin="normal"
              multiline
              rows={3}
              error={!!errors?.description}
              helperText={errors?.description?.message}
              inputProps={{ maxLength: 999 }}
              {...register("description", {
                minLength: {
                  value: 2,
                  message: "No mínimo 2 caracteres",
                },
                maxLength: {
                  value: 999,
                  message: "No máximo 999 caracteres",
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
