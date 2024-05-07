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
import LoginSchema from "src/schemas/LoginSchema";
import { useAuth } from "../../hooks/AuthContext";
import { Colors } from "../../utils/colors";
 import Logo from "../../assets/logo.png";

const SignIn = () => {
  const { user, loading, signIn } = useAuth();
  const { addError, error } = useAPIError();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(LoginSchema),
  });

  const onSubmit = data => {
    signIn(data);

    if (error) addError(error.message, error.status);

    reset({
      email: "",
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

        
        <img src={Logo} width={130} alt="Logo Flash Pay" />
        <Typography variant="h4" color="primary">
          Flash Pay
        </Typography>
        <Typography variant="subtitle2" color="primary"> 
          Acesse sua conta
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

export default SignIn;
