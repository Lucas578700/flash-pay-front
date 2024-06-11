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
import { cpfCnpjMask } from "src/functions/CnpjMask";

import LinearLoader from "src/components/LinearProgress";

import extractErrorDetails from "src/utils/extractErrorDetails";

const initialValue = {
  name: "",
  cnpj: "",
  image: "",
  description: "",
};

function EditFormEstabelecimento() {
  const [estabelecimento, setEstabelecimento] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const { createModal } = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "all",
    defaultValues: initialValue,
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`${routes.shoppe}${id}/`);
      const { cnpj, ...estabelecimentoChange } = data;

      const formData = new FormData();
      formData.append("name", estabelecimentoChange.name);
      formData.append("cnpj", cnpj.replace(/\D/g, ""));
      formData.append("image", estabelecimentoChange.image);
      formData.append("description", estabelecimentoChange.description);

      await api.post(routes.shoppe, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // setEstabelecimento(data || {});
      reset({
        ...estabelecimentoChange,
        cnpj: cpfCnpjMask(cnpj),
      });
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
  }, [createModal]);

  useEffect(() => {
    fetchData();
  }, []);

  const editarEstabelecimento = useCallback(async () => {
    try {
      const { cnpj, ...estabelecimentoChange } = estabelecimento;
      await api.put(`${routes.shoppe}${id}/`, {
        ...estabelecimentoChange,
        cnpj: cnpj.replace(/\D/g, ""),
      });
      await api.put(`${routes.shoppe}${id}/`, estabelecimento);
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
    name => e => {
      const { value } = e.target;
      setEstabelecimento(prevEstabelecimento => ({
        ...prevEstabelecimento,
        [name]: value,
      }));
    },
    [setEstabelecimento]
  );

  const onFileChange = useCallback(e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEstabelecimento(prevEstabelecimento => ({
          ...prevEstabelecimento,
          image: {
            file,
            preview: reader.result,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

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
                value: estabelecimento.cnpj,
                onChange: onChangeField("cnpj"),
              })}
            />
          </Grid>
          <Grid item xs={4}>
            <TextFieldComponent
              variant="outlined"
              label="Descrição"
              placeholder="Digite uma Descrição"
              margin="normal"
              error={!!errors?.description}
              helperText={errors?.description?.message}
              inputProps={{ maxLength: 999 }}
              {...register("description", {
                minLength: {
                  value: 2,
                  message: "No minimo 2 caracteres",
                },
                maxLength: {
                  value: 999,
                  message: "No máximo 999 caracteres",
                },
                value: estabelecimento.description,
                onChange: onChangeField("description"),
              })}
            />
          </Grid>

          <Grid item xs={4}>
            <label htmlFor="upload-image">
              <input
                style={{ display: "none" }}
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
            {estabelecimento.image && (
              <div>
                <img
                  src={estabelecimento.image.preview}
                  alt="Selected"
                  style={{ width: "100px", height: "100px", marginTop: "10px" }}
                />
                <p>{estabelecimento.image.file.name}</p>
              </div>
            )}
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
