import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import MaskedInputComponent from "src/components/InputMask";
import { ModalError, ModalSuccess, useModal } from "src/components/Modals";
import ProfileImageComponent from "src/components/ProfileImage";
import SelectComponent from "src/components/Select";
import cepMask from "src/functions/CepMask";
import { api, routes } from "src/services/api";
import extractErrorDetails from "src/utils/extractErrorDetails";

import dayjs from "dayjs";
import DatePickerComponent from "src/components/DatePicker";
import LinearLoader from "src/components/LinearProgres";
import formatDate from "src/functions/FormatDate";
import userSchema from "src/schemas/UserSchema";
import { apiViaCep } from "src/services/viaCep";
import { useAuth } from "../../hooks/AuthContext";

const initialState = {
  full_name: "",
  email: "",
  password: "",
  confirm_password: "",
  birth_date: new Date("1998-1-1"),
  cpf_cnpj: "",
  telephone: "",
  rg: "",
  foto: "",
  address: {
    cep: "",
    neighborhood: "",
    street: "",
    house_number: 0,
    complement: "",
    city: "",
    state: "",
    country: "",
  },
};

function Perfil() {
  const [usuario, setUser] = useState(initialState);
  const [paises, setPaises] = useState([]);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);

  const [pais, setPais] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [type_user, setTypeUser] = useState("");

  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createModal } = useModal();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm({
    mode: "all",
    defaultValues: initialState,
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [paisResponse, estadoResponse, cidadeResponse, userResponse] =
        await Promise.all([
          api.get(`${routes.country}`),
          api.get(`${routes.state}`),
          api.get(`${routes.city}?limit=5570`),
          api.get(`${routes.user}${user.id}/`),
        ]);

      setPaises(paisResponse.data.results || []);
      setEstados(estadoResponse.data.results || []);
      setCidades(cidadeResponse.data.results || []);

      const { birth_date, address, ...user_change } = userResponse.data || {};

      const data_format = dayjs(birth_date || new Date("1998-1-1")).format(
        "DD-MM-YYYY"
      );
      setUser({
        ...user_change,
        birth_date: new Date(data_format),
        address: {
          ...address,
          country: address?.country,
          state: address?.state,
          city: address?.state,
        },
      });
      reset({
        ...user_change,
        birth_date: new Date(data_format),
        address: {
          ...address,
          country: address?.country,
          state: address?.state,
          city: address?.state,
        },
      });

      setPais(address?.country || "");
      setEstado(address?.state || "");
      setCidade(address?.city || "");
      setTypeUser(user.type_user.toLowerCase())

      setLoading(false);
    } catch (e) {
      console.log(e);
      createModal({
        id: "dados-modal-get",
        Component: ModalError,
        props: {
          id: "dados-modal-get-modal",
          title: "Erro",
          message: "Ocorreu algum erro ao buscar os endereços e dados",
          textConfirmButton: "Ok",
          onClose: () => navigate("/painel/perfil/"),
        },
      });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const onChangeField = useCallback(
    name => e => {
      const { value } = e.target;
      setValue(name, value);
    },
    [setValue]
  );

  const handleBoolean = useCallback(
    name => e => {
      const { checked } = e.target;
      setValue(name, checked);
    },
    [setValue]
  );

  const checkCep = async e => {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length === 8) {
      await searchCep(cep);
    }
  };

  const searchCep = useCallback(
    async cep => {
      try {
        const {
          data: { bairro, complemento, logradouro, localidade, uf },
        } = await apiViaCep.get(`${cep}/json/`);

        const pais =
          paises.find(pais => pais.name === "Brasil")?.id.toString() ?? "";

        const estado =
          estados.find(estado => estado.acronym.includes(uf))?.id.toString() ??
          "";

        const cidade =
          cidades
            .find(cidade => cidade.name.includes(localidade))
            ?.id.toString() ?? "";

        setValue("address.cep", cepMask(cep));
        setValue("address.country", pais);
        setValue("address.city", cidade);
        setValue("address.state", estado);
        setValue("address.street", logradouro || usuario.address.street);
        setValue(
          "address.neighborhood",
          bairro || usuario.address.neighborhood
        );
        setValue(
          "address.complement",
          complemento || usuario.address.complement
        );

        setUser(prevProfessor => ({
          ...prevProfessor,
          address: {
            ...prevProfessor.address,
            cep: cepMask(cep),
            street: logradouro || usuario.address.street,
            neighborhood: bairro || usuario.address.neighborhood,
            complement: complemento || usuario.address.complement,
            country: pais,
            state: estado,
            city: cidade,
          },
        }));
      } catch (e) {
        console.log(e);
        createModal({
          id: "cep-modal-get",
          Component: ModalError,
          props: {
            id: "cep-modal-get-modal",
            title: "Erro",
            message: "Ocorreu algum erro ao buscar o cep",
            textConfirmButton: "Ok",
          },
        });
      }
    },
    [paises, estados, cidades]
  );

  function formatUser() {
    const values = getValues();
    const { birth_date, telephone, address, admin, ...userChange } = values;

    const isEmptyOrNull = value => {
      return value === null || value === undefined || value === "";
    };

    const cleanedAddress = Object.keys(address)
      .filter(key => !isEmptyOrNull(address[key]))
      .reduce((obj, key) => {
        obj[key] = address[key];
        return obj;
      }, {});

    return {
      ...userChange,
      birth_date: formatDate(birth_date),
      telephone: telephone ? telephone.replace(/\D/g, "") : "",
      admin: admin,
      address: {
        ...cleanedAddress,
        cep: address.cep.replace(/\D/g, ""),
      },
    };
  }

  const editarUser = useCallback(async () => {
    const user_save = formatUser();

    try {
      await api.put(`${routes.user}${user.id}/`, user_save);
      createModal({
        id: "user-modal",
        Component: ModalSuccess,
        props: {
          id: "confirm-save-success",
          title: "Sucesso",
          message: "Usuário editado com sucesso",
          textConfirmButton: "Ok",
          onClose: () => navigate("/painel/perfil"),
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
  }, [navigate, createModal, formatUser]);

  if (loading) {
    return <LinearLoader loading={loading} />;
  }

  return (
    <Card>
      <CardHeader title="Perfil" />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <div style={{ marginTop: 16 }}>
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
                  />
                )}
              />
            </div>
          </Grid>
          <Grid item xs={6}>
            <div style={{ marginTop: 16 }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    label="E-mail"
                    required
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <div style={{ marginTop: 16 }}>
              <Controller
                name="cpf_cnpj"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    label="CPF/CNPJ do usuário"
                    required
                    fullWidth
                    InputProps={{
                      inputComponent: MaskedInputComponent,
                      inputProps: {
                        mask: "999.999.999-99",
                      },
                    }}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </div>
          </Grid>
          <Grid item xs={6}>
            <div style={{ marginTop: 16 }}>
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
                  />
                )}
              />
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <div style={{ marginTop: 16 }}>
              <Controller
                name="telephone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    label="Telefone do usuário"
                    fullWidth
                    InputProps={{
                      inputComponent: MaskedInputComponent,
                      inputProps: {
                        mask: "99 9 9999 9999",
                      },
                    }}
                    error={!!errors.telephone}
                    helperText={errors.telephone?.message}
                  />
                )}
              />
            </div>
          </Grid>
          <Grid item xs={6}>
            <div style={{ marginTop: 16 }}>
              <Controller
                name="rg"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    label="RG do usuário"
                    fullWidth
                    error={!!errors.rg}
                    helperText={errors.rg?.message}
                  />
                )}
              />
            </div>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <CardHeader subheader="Editar Permissão" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControlLabel
              control={<Checkbox checked={user.admin} />}
              label="Administrador"
            />
          </Grid>
          <Grid item xs={6}>
            <SelectComponent
              fullWidth
              label="Tipo de usuário"
              {...register("type_user", {
                required: { value: true, message: "Campo obrigatório" },
              })}
              onChange={onChangeField("type_user")}
              options={[
                {
                  value: "administrador",
                  label: "Administrador",
                },
                {
                  value: "vendedor",
                  label: "Vendedor",
                },
              ]}
              defaultValue={type_user}
              erro={errors?.type_user?.message}
            />
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <CardHeader subheader="Editar Endereço" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Controller
              name="address.cep"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  label="Cep do usuário"
                  required
                  fullWidth
                  InputProps={{
                    inputComponent: MaskedInputComponent,
                    inputProps: {
                      mask: "99999-999",
                    },
                  }}
                  error={!!errors.address?.cep}
                  helperText={errors.address?.cep?.message}
                  onBlur={checkCep}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="address.neighborhood"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  label="Bairro do usuário"
                  required
                  fullWidth
                  error={!!errors.address?.neighborhood}
                  helperText={errors.address?.neighborhood?.message}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <div style={{ marginTop: 16 }}>
              <Controller
                name="address.street"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    label="Logradouro do usuário"
                    fullWidth
                    error={!!errors.address?.street}
                    helperText={errors.address?.street?.message}
                  />
                )}
              />
            </div>
          </Grid>
          <Grid item xs={6}>
            <div style={{ marginTop: 16 }}>
              <Controller
                name="address.complement"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    label="Complemento do usuário"
                    fullWidth
                    error={!!errors.address?.complement}
                    helperText={errors.address?.complement?.message}
                  />
                )}
              />
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <div style={{ marginTop: 16 }}>
              <Controller
                name="address.house_number"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    label="Nr da casa"
                    fullWidth
                    error={!!errors.address?.house_number}
                    helperText={errors.address?.house_number?.message}
                  />
                )}
              />
            </div>
          </Grid>
          <Grid item xs={6}>
            <SelectComponent
              fullWidth
              label="País"
              {...register("address.country", {
                required: { value: true, message: "Campo obrigatório" },
              })}
              required
              onChange={onChangeField("address.country")}
              options={paises.map(pais => ({
                value: `${pais.id}`,
                label: pais.name,
              }))}
              defaultValue={pais}
              erro={errors?.address?.country?.message}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <SelectComponent
              fullWidth
              label="Estado"
              {...register("address.state", {
                required: { value: true, message: "Campo obrigatório" },
              })}
              required
              onChange={onChangeField("address.state")}
              options={estados.map(estado => ({
                value: `${estado.id}`,
                label: estado.name,
              }))}
              defaultValue={estado}
              erro={errors?.address?.state?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectComponent
              fullWidth
              label="Cidade"
              {...register("address.city", {
                required: { value: true, message: "Campo obrigatório" },
              })}
              required
              onChange={onChangeField("address.city")}
              options={cidades.map(cidade => ({
                value: `${cidade.id}`,
                label: cidade.name,
              }))}
              defaultValue={cidade}
              erro={errors?.address?.city?.message}
            />
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          p: 2,
        }}>
        <Button
          variant="contained"
          onClick={handleSubmit(editarUser)}
          className="botao-enviar">
          Editar
        </Button>
      </Box>
    </Card>
  );
}

export default Perfil;
