import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
  } from "@mui/material";
  import { id } from "date-fns/locale";
  import { useCallback, useState } from "react";
  import { useForm } from "react-hook-form";
  import { useNavigate } from "react-router-dom";
  import { ModalError, ModalSuccess, useModal } from "src/components/Modals";
  import TextFieldComponent from "src/components/TextField";
  import { api, routes } from "src/services/api";
  // import SelectComponent from "src/components/Select";
  
  import extractErrorDetails from "src/utils/extractErrorDetails";
  
  const initialValue = {
    name: "",
    image: "",
    price: "",
    category: {
      name: "",
    },
    university: {
      name: "",
    },
    quantity: "",
  };
  
  function FormProdutos() {
    const [produto, setProduto] = useState(initialValue);
    const navigate = useNavigate();
    const { createModal } = useModal();
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm({
      mode: "all",
    });
  
    const adicionarProduto = useCallback(async () => {
      try {
        const {  ...produtoChange } = produto;
  
        const formData = new FormData();
        formData.append("name", produtoChange.name);
        formData.append("image", produtoChange.image);
        formData.append("description", produtoChange.description);
        formData.append("price", produtoChange.price);
        formData.append("category", produtoChange.category);
        formData.append("university", produtoChange.university);
  
        await api.post(
          routes.product,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
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
  
    return (
      <Card>
        <CardHeader
          title="Produtos"
          subheader="Cadastrar Produto"
        />
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
                  value: produto.description,
                  onChange: onChangeField("description"),
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

          {/* <Grid item xs={6}>
            <SelectComponent
              fullWidth
              label="Categoria"
              value={produto.category}
              defaultValue={produto.category}
              {...register("produto.category", {
                required: { value: true, message: "Campo obrigatório" },
              })}
              onChange={onChangeField("produto.category")}
              options={categorias.map(state => ({
                value: `${category.id}`,
                label: category.nome,
              }))}
              erro={errors?.produto?.category?.message}
            />
          </Grid> */}

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
  