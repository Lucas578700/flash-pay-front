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
import { api, routes } from "src/services/api";
import SelectComponent from "src/components/Select";

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

function FormProdutos() {
  const [loading, setLoading] = useState(false);
  const [produto, setProduto] = useState(initialValue);
  const [universidades, setUniversidades] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [barracas, setBarracas] = useState([]);
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
      const [categoryResponse, univerityResponse, shoppeResponse] = await Promise.all([
        api.get(`${routes.category}`),
        api.get(`${routes.university}`),
        api.get(`${routes.shoppe}`),
      ]);

      setCategorias(categoryResponse.data.results || []);
      setUniversidades(univerityResponse.data.results || []);
      setBarracas(shoppeResponse.data.results || []);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      createModal({
        id: "dados-modal-get",
        Component: ModalError,
        props: {
          id: "dados-modal-get-modal",
          title: "Erro",
          message: "Ocorreu algum erro ao buscar categorias",
          textConfirmButton: "Ok",
          onClose: () => navigate("/painel"),
        },
      });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const adicionarProduto = useCallback(async () => {
    try {
      const { ...produtoChange } = produto;

      const formData = new FormData();
      formData.append("name", produtoChange.name);
      formData.append("image", produtoChange.image);
      formData.append("description", produtoChange.description);
      formData.append("price", produtoChange.price);
      formData.append("category", produtoChange.category);
      formData.append("university", produtoChange.university);

      await api.post(routes.product, formData, {
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
          message: "Produto cadastrado com sucesso",
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
  }, [createModal, navigate, produto]);

  const onChangeField = useCallback(
    name => e => {
      const { value } = e.target;
      setProduto(prevProduto => ({
        ...prevProduto,
        [name]: value,
      }));
    },
    []
  );

  const onFileChange = useCallback(e => {
    const file = e.target.files[0];
    setProduto(prevProduto => ({
      ...prevProduto,
      image: file,
    }));
  }, []);

  if (loading) {
    return <LinearLoader loading={loading} />;
  }

  return (
    <Card>
      <CardHeader title="Produtos" subheader="Cadastrar Produto" />
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
                value: produto.name,
                onChange: onChangeField("name"),
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
                value: produto.price,
                onChange: onChangeField("price"),
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
                value: produto.quantity,
                onChange: onChangeField("quantity"),
              })}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <SelectComponent
              fullWidth
              label="Universidade"
              value={produto.university}
              defaultValue={produto.university}
              {...register("university", {
                required: { value: true, message: "Campo obrigatório" },
              })}
              onChange={onChangeField("university")}
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
              value={produto.shoppe}
              defaultValue={produto.shoppe}
              {...register("shoppe", {
                required: { value: true, message: "Campo obrigatório" },
              })}
              onChange={onChangeField("shoppe")}
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
              value={produto.category}
              defaultValue={produto.category}
              {...register("category", {
                required: { value: true, message: "Campo obrigatório" },
              })}
              onChange={onChangeField("category")}
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
                name="upload-image"
                type="file"
                accept="image/*"
                onChange={onFileChange}
              />
              <Button color="secondary" variant="contained" component="span">
                Upload Imagem
              </Button>
            </label>
            {produto.image && <p>{produto.image.name}</p>}
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
                value: produto.description,
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
            onClick={handleSubmit(adicionarProduto)}
            className="botao-enviar">
            Cadastrar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default FormProdutos;
