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
  const [universidades, setUniversidades] = useState([]);
  const [imageName, setImageName] = useState("");
  const navigate = useNavigate();
  const { createModal } = useModal();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    mode: "all",
    defaultValues: initialValue,
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

  const adicionarEstabelecimento = useCallback(
    async data => {
      try {
        const { cnpj, image, ...estabelecimentoChange } = data;

        const formData = new FormData();
        formData.append("name", estabelecimentoChange.name);
        formData.append("cnpj", cnpj.replace(/\D/g, ""));
        formData.append("image", image[0]);
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
    },
    [createModal, navigate]
  );

  const onFileChange = useCallback(
    e => {
      const file = e.target.files;
      setValue("image", file);
      setImageName(file[0]?.name || "");
    },
    [setValue]
  );

  const onChangeField = useCallback(
    name => e => {
      const { value } = e.target;
      setValue(name, value);
    },
    [setValue]
  );

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
              placeholder="CNPJ"
              margin="normal"
              required
              error={!!errors?.cnpj}
              helperText={errors?.cnpj?.message}
              inputProps={{ maxLength: 50 }}
              {...register("cnpj", {
                required: { value: true, message: "Campo obrigatório" },
                maxLength: {
                  value: 50,
                  message: "No máximo 50 dígitos",
                },
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
              onChange={onChangeField("university")}
              options={universidades.map(university => ({
                value: `${university.id}`,
                label: university.name,
              }))}
              error={errors?.university?.message}
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
            {imageName && <p>{imageName}</p>}
            {errors?.image && <p>{errors?.image.message}</p>}
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
