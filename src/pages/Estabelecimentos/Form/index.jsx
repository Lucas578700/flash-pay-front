import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ModalError, ModalSuccess, useModal } from "src/components/Modals";
import TextFieldComponent from "src/components/TextField";
import SelectComponent from "src/components/Select";
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

function FormEstabelecimento() {
  const [loading, setLoading] = useState(false);
  const [estabelecimento, setEstabelecimento] = useState(initialValue);
  const [universidades, setUniversidades] = useState([]);
  const navigate = useNavigate();
  const { createModal } = useModal();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [univerityResponse] = await Promise.all([
        api.get(`${routes.university}`),
      ]);

      setUniversidades(univerityResponse.data.results || []);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      createModal({
        id: "dados-modal-get",
        Component: ModalError,
        props: {
          id: "dados-modal-get-modal",
          title: "Erro",
          message: "Ocorreu algum erro ao buscar universidades",
          textConfirmButton: "Ok",
          onClose: () => navigate("/painel"),
        },
      });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const adicionarEstabelecimento = useCallback(async () => {
    try {
      const { cnpj, ...estabelecimentoChange } = estabelecimento;

      const formData = new FormData();
      formData.append("name", estabelecimentoChange.name);
      formData.append("cnpj", cnpj.replace(/\D/g, ""));
      formData.append("image", estabelecimentoChange.image);
      formData.append("description", estabelecimentoChange.description);
      formData.append("university", estabelecimentoChange.university);

      await api.post(routes.shoppe, formData, {
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
    name => e => {
      const { value } = e.target;
      setEstabelecimento(prevEstabelecimento => ({
        ...prevEstabelecimento,
        [name]: value,
      }));
    },
    []
  );

  const onFileChange = useCallback(e => {
    const file = e.target.files[0];
    setEstabelecimento(prevEstabelecimento => ({
      ...prevEstabelecimento,
      image: file,
    }));
  }, []);

  if (loading) {
    return <LinearLoader loading={loading} />;
  }

  return (
    <Card>
      <CardHeader
        title="Estabelecimentos"
        subheader="Cadastrar Estabelecimento"
      />
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
              placeholder="CNPJ"
              margin="normal"
              required
              error={!!errors?.cnpj}
              helperText={errors?.cnpj?.message}
              inputProps={{ maxLength: 50 }}
              value={cpfCnpjMask(estabelecimento.cnpj)}
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
                value: estabelecimento.cnpj,
                onChange: onChangeField("cnpj"),
              })}
            />
          </Grid>

          <Grid item xs={4}>
            <SelectComponent
              fullWidth
              label="Universidade"
              value={estabelecimento.university}
              defaultValue={estabelecimento.university}
              {...register("university", {
                required: { value: true, message: "Campo obrigatório" },
              })}
              onChange={onChangeField("university")}
              options={universidades.map(university => ({
                value: `${university.id}`,
                label: university.name,
              }))}
              erro={errors?.estabelecimento?.university?.message}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <label htmlFor="upload-image">
              <input
                style={{ display: "none", marginBottom: 2 }}
                id="upload-image"
                name="upload-image"
                type="file"
                accept="image/*"
                onChange={onFileChange}
              />
              <Button color="secondary" variant="contained" component="span">
                Upload Imagem
              </Button>
            </label>
            {estabelecimento.image && <p>{estabelecimento.image.name}</p>}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item md={12} xs={12}>
            <TextFieldComponent
              variant="outlined"
              label="Descrição"
              placeholder="Digite a descrição"
              margin="normal"
              multiline
              rows={3}
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
