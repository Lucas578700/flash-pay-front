import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import useAPIError from "src/hooks/useAPIError";
import SignUpSchema from "src/schemas/SignUpSchema";
import { useAuth } from "../../hooks/AuthContext";
import { Colors } from "../../utils/colors";
import { Title2 } from "./styles";
import DatePickerComponent from "../../components/DatePicker";

const SignUp = () => {
  const { user, loading, signUp } = useAuth();
  const { addError, error } = useAPIError();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      full_name: "",
      email: "",
      birth_date: "",
      telephone: "",
      rg: "",
      cpf_cnpj: "",
      password: "",
    },
    resolver: yupResolver(SignUpSchema),
  });

  const onSubmit = data => {
    signUp(data);

    if (error) addError(error.message, error.status);

    reset({
      full_name: "",
      email: "",
      birth_date: "",
      telephone: "",
      rg: "",
      cpf_cnpj: "",
      password: "",
    });
  };

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) navigate("/");
  }, [user, loading, navigate]);

  return (
    <Container maxWidth="xl" sx={{ paddingTop: 8 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>

        
        
        <Title2 variant="h4" color="primary">
          Flash Pay
        </Title2>
        <Typography variant="subtitle2" color="primary"> 
          Cadastre-se
        </Typography>
        <Paper
          elevation={2}
          sx={{
            marginTop: 4,
            paddingY: 4,
            paddingX: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "40%",
            gap: 2,
            border: `1px solid #${Colors.primary}`,
          }}>
          <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
              name="full_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  label="Nome"
                  required
                  fullWidth
                  error={!!errors.full_name}
                  helperText={errors.full_name?.message}
                  sx={{ marginBottom: 2 }}
                />
              )}
              />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  label="Login"
                  required
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{ marginBottom: 2 }}
                />
              )}
            />

              <Controller
                name="birth_date"
                control={control}
                render={({ field }) => (
                  <DatePickerComponent
                    {...field}
                    label="Data de Nascimento"
                    required
                    fullWidth
                    error={!!errors.birth_date}
                    helperText={errors.birth_date?.message}
                    sx={{ marginBottom: 2 }}
                  />
                )}
              />

            <Controller
              name="telephone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  label="Telefone"
                  required
                  fullWidth
                  error={!!errors.telephone}
                  helperText={errors.telephone?.message}
                  sx={{ marginBottom: 2 }}
                />
              )}
            />

            <Controller
              name="rg"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  label="RG"
                  required
                  fullWidth
                  error={!!errors.rg}
                  helperText={errors.rg?.message}
                  sx={{ marginBottom: 2 }}
                />
              )}
            />

            <Controller
              name="cpf_cnpj"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  label="CPF/CNPJ"
                  required
                  fullWidth
                  error={!!errors.cpf_cnpj}
                  helperText={errors.cpf_cnpj?.message}
                  sx={{ marginBottom: 2 }}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  label="Senha"
                  required
                  fullWidth
                  type="password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={{ marginBottom: 2 }}
                />
              )}
            />
            <Container
              disableGutters
              sx={{
                marginY: 2,
                display: "flex",
                flexDirection: "row",
                gap: 2,
                justifyContent: "flex-end",
              }}>
              <Button
                variant="text"
                type="button"
                sx={{ borderRadius: 25, color: Colors.primary }}
                onClick={() => navigate("/")}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                type="submit"
                sx={{ borderRadius: 25, backgroundColor: Colors.primary }}>
                Entrar
              </Button>
            </Container>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignUp;
