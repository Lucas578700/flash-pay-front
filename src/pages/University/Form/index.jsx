import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
  } from "@mui/material";
  import { useCallback, useState } from "react";
  import { useForm } from "react-hook-form";
  import { useNavigate } from "react-router-dom";
  import { ModalError, ModalSuccess, useModal } from "src/components/Modals";
  import TextFieldComponent from "src/components/TextField";
  import { api, routes } from "src/services/api";
  
  import extractErrorDetails from "src/utils/extractErrorDetails";
  
  function FormUniversity() {
    const [universidade, setUniversity] = useState<FormState>(initialValue);
    const navigate = useNavigate();
    const { createModal } = useModal();
    const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
    } = useForm<FormState>({
      mode: "all",
    });
  
    const adicionarUniversity = useCallback(async () => {
      try {
        await api.post(routes.universidade, universidade);
        createModal({
          id: "universidade-modal",
          Component: ModalSuccess,
          props: {
            id: "confirm-save-success",
            title: "Sucesso",
            message: "Universidade cadastrada com sucesso",
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
      (name) => (e) => {
        const { value } = e.target;
        setUniversity(prevUniversity => ({
          ...prevUniversity,
          [name]: value,
        }));
        if (name === "status") {
          setValue("status", value, { shouldValidate: true });
        }
      },
      [setValue]
    );
  
    return (
      <Card>
        <CardHeader title="Universidades" subheader="Cadastrar Universidade" />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextFieldComponent
                variant="outlined"
                label="Nome da Universidade"
                placeholder="Nome do Universidade"
                margin="normal"
                required
                error={!!errors?.name}
                helperText={errors?.name?.message}
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
                  value: universidade.name,
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
                type="number"
                required
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
              onClick={handleSubmit(adicionarUniversity)}
              className="botao-enviar">
              Cadastrar
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }
  
  export default FormUniversity;
  