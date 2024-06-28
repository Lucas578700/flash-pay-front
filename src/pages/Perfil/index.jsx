import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import MaskedInputComponent from "src/components/InputMask";
import { ModalError, ModalSuccess, useModal } from "src/components/Modals";
import ProfileImageComponent from "src/components/ProfileImage";
import SelectComponent from "src/components/Select";
import TextFieldComponent from "src/components/TextField";
import cepMask from "src/functions/CepMask";
import { cpfCnpjMask } from "src/functions/CnpjMask";
import { api, routes } from "src/services/api";
import extractErrorDetails from "src/utils/extractErrorDetails";

import dayjs from "dayjs";
import DatePickerComponent from "src/components/DatePicker";
import LinearLoader from "src/components/LinearProgres";
import formatDate from "src/functions/FormatDate";
import setNestedValue from "src/functions/SetNestedValue";
import userSchema from "src/schemas/UserSchema";
import { apiViaCep } from "src/services/viaCep";
import { useAuth } from "../../hooks/AuthContext";

const initialState = {
  full_name: "",
  email: "",
  password: "",
  confirm_password: "",
  birth_date: new Date("01-01-1998"),
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
  } = useForm({
    mode: "all",
    resolver: yupResolver(userSchema.omit(["password", "confirm_password"])),
  });

  const onChangeField = useCallback(
    name => e => {
      const { value } = e.target;

      setUser(prevUser => setNestedValue({ ...prevUser }, name, value));
      setValue(name, value);
    },
    [setUser, setValue]
  );

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

      const data_format = dayjs(birth_date || "18/08/1998").format(
        "DD-MM-YYYY"
      );
      setUser({
        ...user_change,
        birth_date: new Date(data_format),
        address: {
          ...address,
          country: address?.country?.id,
          state: address?.state?.id,
          city: address?.state?.id,
        },
      });

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

        const country =
          paises.find(country => country.name === "Brasil")?.id.toString() ?? "";

        const state =
          estados.find(state => state.name.includes(uf))?.id.toString() ?? "";

        const city =
          cidades
            .find(city => city.name.includes(localidade))
            ?.id.toString() ?? "";

        setValue("address.cep", cepMask(cep));
        setValue("address.country", country);
        setValue("address.city", city);
        setValue("address.state", state);
        setValue(
          "address.street",
          logradouro || usuario.address.street
        );
        setValue("address.neighborhood", bairro || usuario.address.neighborhood);
        setValue(
          "address.complement",
          complemento || usuario.address.complement
        );

        setUser(prevUsuario => ({
          ...prevUsuario,
          address: {
            ...prevUsuario.address,
            cep: cepMask(cep),
            street: logradouro || usuario.address.street,
            neighborhood: bairro || usuario.address.neighborhood,
            complement: complemento || usuario.address.complement,
            country: country,
            state: state,
            city: city,
          },
        }));
      } catch (e) {
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
    const { birth_date, telephone, address, ...userChange } = usuario;

    return {
      ...userChange,
      birth_date: formatDate(birth_date),
      telephone: telephone ? telephone.replace(/\D/g, "") : "",
      address: {
        ...address,
        cep: address.cep.replace(/\D/g, ""),
      },
    };
  }

  const editarUser = useCallback(async () => {
    const user_save = formatUser();

    try {
      await api.put(`${routes.user}${user.origem_id}/`, user_save);
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
          <Grid item xs={4}>
            <ProfileImageComponent image={usuario?.foto || ""} />
          </Grid>
          <Grid item xs={4}>
            <Typography fontSize={22}>
              Nome: {usuario?.full_name || "Usuário sem nome"}
            </Typography>
            <Typography>E-mail: {usuario.email}</Typography>
            <Typography>Telefone: {usuario?.telephone}</Typography>
            <Typography>
              Data de Nascimento:{" "}
              {dayjs(usuario.birth_date || "18/08/1998").format("DD/MM/YYYY")}
            </Typography>
            <Typography>CPF/CNPJ: {usuario.cpf_cnpj}</Typography>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <CardHeader title="Conta" />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextFieldComponent
              variant="outlined"
              label="Nome"
              placeholder="Nome do professor"
              erro={errors?.full_name?.message}
              margin="normal"
              required
              inputProps={{ maxLength: 50 }}
              {...register("full_name", {
                required: { value: true, message: "Campo obrigatório" },
                minLength: {
                  value: 2,
                  message: "No minimo 2 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "No máximo 50 caracteres",
                },
                value: usuario.full_name,
                onChange: onChangeField("full_name"),
              })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextFieldComponent
              variant="outlined"
              label="E-mail"
              placeholder="E-mail do professor"
              erro={errors?.email?.message}
              margin="normal"
              type="email"
              required
              inputProps={{ maxLength: 50 }}
              {...register("email", {
                required: { value: true, message: "Campo obrigatório" },
                minLength: { value: 2, message: "No mínimo 2 caracteres" },
                maxLength: {
                  value: 50,
                  message: "No máximo 50 caracteres",
                },
              })}
              value={usuario.email}
              onChange={onChangeField("email")}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextFieldComponent
              variant="outlined"
              label="CPF/CNPJ"
              placeholder="CPF/CNPJ do professor"
              erro={errors?.cpf_cnpj?.message}
              margin="normal"
              required
              value={cpfCnpjMask(usuario.cpf_cnpj || "")}
              inputProps={{ maxLength: 50 }}
              {...register("cpf_cnpj", {
                required: { value: true, message: "Campo obrigatório" },
                minLength: {
                  value: 2,
                  message: "No minimo 11 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "No máximo 14 caracteres",
                },
                value: usuario.cpf_cnpj,
                onChange: onChangeField("cpf_cnpj"),
              })}
            />
          </Grid>
          <Grid item xs={6}>
            <div style={{ marginTop: 16 }}>
              <Controller
                name="birth_date"
                control={control}
                defaultValue={usuario.birth_date}
                render={({ field, fieldState: { error } }) => (
                  <DatePickerComponent
                    field={field}
                    label="Data de nascimento"
                    error={error}
                    {...register("birth_date", {
                      required: {
                        value: true,
                        message: "Campo obrigatório",
                      },
                      value: usuario.birth_date,
                      onChange: onChangeField("birth_date"),
                    })}
                  />
                )}
              />
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextFieldComponent
              variant="outlined"
              label="Telefone"
              placeholder="Telefone do usuario"
              erro={errors?.telephone?.message}
              margin="normal"
              InputProps={{
                inputComponent: MaskedInputComponent,
                inputProps: {
                  mask: "99 9 9999 9999",
                },
              }}
              {...register("telephone", {
                required: { value: true, message: "Campo obrigatório" },
                minLength: {
                  value: 2,
                  message: "No minimo 2 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "No máximo 50 caracteres",
                },
                value: usuario.telephone,
                onChange: onChangeField("telephone"),
              })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextFieldComponent
              variant="outlined"
              label="RG"
              placeholder="RG do usuario"
              erro={errors?.rg?.message}
              margin="normal"
              inputProps={{ maxLength: 50 }}
              {...register("rg", {
                required: { value: true, message: "Campo obrigatório" },
                minLength: { value: 2, message: "No mínimo 2 caracteres" },
                maxLength: {
                  value: 50,
                  message: "No máximo 50 caracteres",
                },
              })}
              value={usuario.rg}
              onChange={onChangeField("rg")}
            />
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <CardHeader subheader="Cadastrar Endereço" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextFieldComponent
              variant="outlined"
              label="Cep"
              placeholder="Cep do professor"
              erro={errors?.address?.cep?.message}
              margin="normal"
              required
              InputProps={{
                inputComponent: MaskedInputComponent,
                inputProps: {
                  value: usuario.address.cep,
                  mask: "99999-999",
                },
              }}
              {...register("address.cep", {
                required: { value: true, message: "Campo obrigatório" },
                minLength: {
                  value: 8,
                  message: "No minimo 8 caracteres",
                },
                maxLength: {
                  value: 8,
                  message: "No máximo 8 caracteres",
                },
                onChange: onChangeField("address.cep"),
                onBlur: e => {
                  checkCep(e);
                },
              })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextFieldComponent
              variant="outlined"
              label="Bairro"
              placeholder="Bairro do usuario"
              erro={errors?.address?.bairro?.message}
              margin="normal"
              inputProps={{ maxLength: 50 }}
              {...register("address.bairro", {
                minLength: {
                  value: 2,
                  message: "No minimo 8 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "No máximo 50 caracteres",
                },
                value: usuario.address.bairro,
                onChange: onChangeField("address.bairro"),
              })}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextFieldComponent
              variant="outlined"
              label="Logradouro"
              placeholder="Logradouro"
              erro={errors?.address?.street?.message}
              margin="normal"
              required
              inputProps={{ maxLength: 50 }}
              {...register("address.street", {
                required: { value: true, message: "Campo obrigatório" },
                minLength: {
                  value: 2,
                  message: "No minimo 8 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "No máximo 50 caracteres",
                },
                value: usuario.address.street,
                onChange: onChangeField("address.street"),
              })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextFieldComponent
              variant="outlined"
              label="Complemento"
              placeholder="Complemento"
              erro={errors?.address?.complement?.message}
              margin="normal"
              inputProps={{ maxLength: 50 }}
              {...register("address.complement", {
                required: { value: true, message: "Campo obrigatório" },
                minLength: {
                  value: 2,
                  message: "No minimo 8 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "No máximo 50 caracteres",
                },
                value: usuario.address.complement,
                onChange: onChangeField("address.complement"),
              })}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextFieldComponent
              variant="outlined"
              label="N° Casa"
              placeholder="N° Casa"
              erro={errors?.address?.house_number?.message}
              margin="normal"
              type="number"
              inputProps={{ maxLength: 50 }}
              {...register("address.house_number", {
                minLength: {
                  value: 2,
                  message: "No minimo 8 caracteres",
                },
                maxLength: {
                  value: 6,
                  message: "No máximo 50 caracteres",
                },
                value: usuario.address.house_number,
                onChange: onChangeField("address.house_number"),
              })}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectComponent
              fullWidth
              label="País"
              value={usuario.address.country}
              defaultValue={usuario.address.country}
              {...register("address.country", {
                required: { value: true, message: "Campo obrigatório" },
              })}
              onChange={onChangeField("address.country")}
              options={paises.map(country => ({
                value: `${country.id}`,
                label: country.nome,
              }))}
              erro={errors?.address?.country?.message}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <SelectComponent
              fullWidth
              label="Estado"
              value={usuario.address.state}
              defaultValue={usuario.address.state}
              {...register("address.state", {
                required: { value: true, message: "Campo obrigatório" },
              })}
              onChange={onChangeField("address.state")}
              options={estados.map(state => ({
                value: `${state.id}`,
                label: state.nome,
              }))}
              erro={errors?.address?.state?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectComponent
              fullWidth
              label="Cidade"
              value={usuario.address.city}
              defaultValue={usuario.address.city}
              {...register("address.city", {
                required: { value: true, message: "Campo obrigatório" },
              })}
              onChange={onChangeField("address.city")}
              options={cidades.map(city => ({
                value: `${city.id}`,
                label: city.nome,
              }))}
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
