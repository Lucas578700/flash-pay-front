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

import LinearLoader from "src/components/LinearProgres";

import extractErrorDetails from "src/utils/extractErrorDetails";

const initialValue = {
  name: "",
  image: "",
  price: "",
  category: "",
  university: "",
  shoppe: "",
  quantity: "",
};

function EditFormProduct() {
  const [loading, setLoading] = useState(false);
  const [universidades, setUniversidades] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [barracas, setBarracas] = useState([]);
  const [universidade, setUniversidade] = useState("");
  const [categoria, setCategoria] = useState("");
  const [barraca, setBarraca] = useState("");

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

      const [
        productResponse,
        categoryResponse,
        univerityResponse,
        shoppeResponse,
      ] = await Promise.all([
        api.get(`${routes.product}${id}/`),
        api.get(`${routes.category}`),
        api.get(`${routes.university}`),
        api.get(`${routes.shoppe}`),
      ]);

      setCategorias(categoryResponse.data.results || []);
      setUniversidades(univerityResponse.data.results || []);
      setBarracas(shoppeResponse.data.results || []);

      const { cnpj, image, university, shoppe, category, ...productChange } =
        productResponse.data || {};
      setImage(image);
      reset({
        ...productChange,
        university: String(university.id),
        category: String(category.id),
        shoppe: String(shoppe.id),
      });
      setUniversidade(String(university.id));
      setCategoria(String(category.id));
      setBarraca(String(shoppe.id));
    } catch (e) {
      reset(initialValue);
      createModal({
        id: "confirm-get-erro-modal",
        Component: ModalError,
        props: {
          id: "confirm-get-erro",
          title: "Erro",
          message: "Ops, aconteceu algum erro ao buscar o produto",
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

  const editarProduto = useCallback(
    async data => {
      try {
        const { cnpj, image, ...produtoChange } = data;
        const formData = new FormData();
        formData.append("name", produtoChange.name);
        formData.append("description", produtoChange.description);
        if (!image) {
          formData.append("image", image);
        }

        await api.put(`${routes.product}${id}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        createModal({
          id: "produto-modal",
          Component: ModalSuccess,
          props: {
            id: "confirm-save-success",
            title: "Sucesso",
            message: "Produto editado com sucesso",
            textConfirmButton: "Ok",
            onClose: () => navigate("/painel/produto"),
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
      <CardHeader title="Produtos" subheader="Editar Produto" />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextFieldComponent
              variant="outlined"
              label="Nome"
              placeholder="Nome do Produto"
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
              })}
            />
          </Grid>

          <Grid item xs={4}>
            <TextFieldComponent
              variant="outlined"
              label="Preço"
              placeholder="Preço do Produto"
              margin="normal"
              required
              error={!!errors?.price}
              helperText={errors?.price?.message}
              inputProps={{ maxLength: 50 }}
              {...register("price", {
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

          <Grid item xs={4}>
            <TextFieldComponent
              variant="outlined"
              label="Quantidade"
              placeholder="Quantidade"
              margin="normal"
              required
              error={!!errors?.quantity}
              helperText={errors?.quantity?.message}
              inputProps={{ maxLength: 50 }}
              {...register("quantity", {
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
        <Grid container spacing={2}>
          <Grid item xs={6}>
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
              erro={errors?.produto?.university?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectComponent
              fullWidth
              label="Barracas"
              {...register("shoppe", {
                required: { value: true, message: "Campo obrigatório" },
              })}
              value={barraca}
              options={barracas.map(shoppe => ({
                value: `${shoppe.id}`,
                label: shoppe.name,
              }))}
              erro={errors?.produto?.shoppe?.message}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <SelectComponent
              fullWidth
              label="Categoria"
              {...register("category", {
                required: { value: true, message: "Campo obrigatório" },
              })}
              value={categoria}
              options={categorias.map(category => ({
                value: `${category.id}`,
                label: category.name,
              }))}
              erro={errors?.produto?.category?.message}
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
              placeholder="Descrição do Produto"
              margin="normal"
              multiline
              rows={3}
              error={!!errors?.description}
              helperText={errors?.description?.message}
              inputProps={{ maxLength: 500 }}
              {...register("description", {
                required: { value: true, message: "Campo obrigatório" },
                minLength: {
                  value: 2,
                  message: "No minimo 2 caracteres",
                },
                maxLength: {
                  value: 500,
                  message: "No máximo 500 caracteres",
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
            onClick={handleSubmit(editarProduto)}
            className="botao-enviar">
            Editar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default EditFormProduct;
