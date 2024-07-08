import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import MaskedInputComponent from "src/components/InputMask";
import { ModalError, ModalSuccess, useModal } from "src/components/Modals";
import SelectComponent from "src/components/Select";
import TextFieldComponent from "src/components/TextField";
import { cpfCnpjMask } from "src/functions/CnpjMask";
import { api, routes } from "src/services/api";
import extractErrorDetails from "src/utils/extractErrorDetails";

import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import DatePickerComponent from "src/components/DatePicker";
import LinearLoader from "src/components/LinearProgres";
import cepMask from "src/functions/CepMask";
import formatDate from "src/functions/FormatDate";
import setNestedValue from "src/functions/SetNestedValue";
import { apiViaCep } from "src/services/viaCep";

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
  admin: false,
  password: "",
  confirm_password: "",
  type_user: "",
};

function EditFormUsuario() {
  const navigate = useNavigate();
  const [user, setUser] = useState(initialState);
  const [paises, setPaises] = useState([]);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);

  console.log(user.type_user);

  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const { createModal } = useModal();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    mode: "all",
    defaultValues: initialState
  });

  const onChangeField = useCallback(
    (name) => (e) => {
      const { value } = e.target;

      setUser(prevProfessor =>
        setNestedValue({ ...prevProfessor }, name, value)
      );
      setValue(name, value);
    },
    [setUser, setValue]
  );

  const handleBoolean = useCallback(
    (name) => (e) => {
      const { checked } = e.target;

      setUser(prevProfessor =>
        setNestedValue({ ...prevProfessor }, name, checked)
      );
      setValue(name, checked);
    },
    [setUser, setValue]
  );

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [
        paisResponse,
        estadoResponse,
        cidadeResponse,
        userResponse,
      ] = await Promise.all([
        api.get(`${routes.country}`),
        api.get(`${routes.state}`),
        api.get(`${routes.city}?limit=5570`),
        api.get(`${routes.user}${id}/`),
      ]);

      setPaises(paisResponse.data.results || []);
      setEstados(estadoResponse.data.results || []);
      setCidades(cidadeResponse.data.results || []);

      const {
        birth_date,
        address,
        admin,
        ...user_change
      } = userResponse.data || {};

      const data_format = dayjs(birth_date || new Date("1998-1-1")).format("DD-MM-YYYY");
      setUser({
        ...user_change,
        birth_date: new Date(data_format),
        admin: admin,
        address: {
          ...address,
          country: address?.country?.id || "",
          state: address?.state?.id || "",
          city: address?.city?.id || "",
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
          onClose: () => navigate("/painel"),
        },
      });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const checkCep = async (e) => {
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
          estados.find(estado => estado.acronym.includes(uf))?.id.toString() ?? "";

        const cidade =
          cidades
            .find(cidade => cidade.name.includes(localidade))
            ?.id.toString() ?? "";

        setValue("address.cep", cepMask(cep));
        setValue("address.country", pais);
        setValue("address.city", cidade);
        setValue("address.state", estado);
        setValue("address.street", logradouro || user.address.street);
        setValue(
          "address.neighborhood",
          bairro || user.address.neighborhood
        );
        setValue(
          "address.complement",
          complemento || user.address.complement
        );

        setUser(prevProfessor => ({
          ...prevProfessor,
          address: {
            ...prevProfessor.address,
            cep: cepMask(cep),
            street: logradouro || user.address.street,
            neighborhood: bairro || user.address.neighborhood,
            complement: complemento || user.address.complement,
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
    const { birth_date, telephone, address, admin, ...userChange } =
      user;

    return {
      ...userChange,
      birth_date: formatDate(birth_date),
      telephone: telephone ? telephone.replace(/\D/g, "") : "",
      admin: admin,
      address: {
        ...address,
        cep: address.cep.replace(/\D/g, ""),
      },
    };
  }

  const editarUsuario = useCallback(async () => {
    const user_save = formatUser();

    try {
      await api.put(`${routes.user}${id}/`, user_save);
      createModal({
        id: "user-modal",
        Component: ModalSuccess,
        props: {
          id: "confirm-save-success",
          title: "Sucesso",
          message: "Usuário editado com sucesso",
          textConfirmButton: "Ok",
          onClose: () => navigate("/painel/user"),
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
      <CardHeader title="Usuários" subheader="Editar Usuário" />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextFieldComponent
              variant="outlined"
              label="Nome"
              placeholder="Nome do usuário"
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
                value: user.full_name,
                onChange: onChangeField("full_name"),
              })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextFieldComponent
              variant="outlined"
              label="E-mail"
              placeholder="E-mail do usuário"
              erro={errors?.email?.message}
              margin="normal"
              type="email"
              required
              inputProps={{ maxLength: 50 }}
              {...register("email", {
                required: { value: true, message: "Campo obrigatório" },
                minLength: { value: 2, message: "No mínimo 2 caracteres" },
                maxLength: { value: 50, message: "No máximo 50 caracteres" },
              })}
              value={user.email}
              onChange={onChangeField("email")}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextFieldComponent
              variant="outlined"
              label="CPF/CNPJ"
              placeholder="CPF/CNPJ do usuário"
              erro={errors?.cpf_cnpj?.message}
              margin="normal"
              required
              value={cpfCnpjMask(user.cpf_cnpj || "")}
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
                value: user.cpf_cnpj,
                onChange: onChangeField("cpf_cnpj"),
              })}
            />
          </Grid>
          <Grid item xs={6}>
            <div style={{ marginTop: 16 }}>
              <Controller
                name={"birth_date"}
                control={control}
                defaultValue={user?.birth_date}
                render={({ field, fieldState: { error } }) => (
                  <DatePickerComponent
                    field={field}
                    label="Data de nascimento"
                    error={error}
                    {...register("birth_date", {
                      required: { value: true, message: "Campo obrigatório" },
                      value: user.birth_date,
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
              placeholder="Telefone do usuário"
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
                value: user.telephone,
                onChange: onChangeField("telephone"),
              })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextFieldComponent
              variant="outlined"
              label="RG"
              placeholder="RG do professor"
              erro={errors?.rg?.message}
              margin="normal"
              inputProps={{ maxLength: 50 }}
              {...register("rg", {
                required: { value: true, message: "Campo obrigatório" },
                minLength: { value: 2, message: "No mínimo 2 caracteres" },
                maxLength: { value: 50, message: "No máximo 50 caracteres" },
              })}
              value={user.rg}
              onChange={onChangeField("rg")}
            />
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <CardHeader subheader="Cadastrar Permissão" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={user.admin}
                  onChange={handleBoolean("admin")}
                />
              }
              label="Administrador"
            />
          </Grid>
          <Grid item xs={6}>
            <SelectComponent
              fullWidth
              label="Tipo de usuário"
              value={user.type_user}
              defaultValue={user.type_user}
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
            <TextFieldComponent
              variant="outlined"
              label="Cep"
              placeholder="Cep do usuário"
              erro={errors?.address?.cep?.message}
              margin="normal"
              required
              InputProps={{
                inputComponent: MaskedInputComponent,
                inputProps: {
                  value: user.address.cep,
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
                onBlur: (e) => {
                  checkCep(e);
                },
              })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextFieldComponent
              variant="outlined"
              label="Bairro"
              placeholder="Bairro do usuário"
              erro={errors?.address?.neighborhood?.message}
              margin="normal"
              inputProps={{ maxLength: 50 }}
              {...register("address.neighborhood", {
                minLength: {
                  value: 2,
                  message: "No minimo 8 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "No máximo 50 caracteres",
                },
                value: user.address?.neighborhood,
                onChange: onChangeField("address.neighborhood"),
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
                value: user.address?.street,
                onChange: onChangeField("address.street"),
              })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextFieldComponent
              variant="outlined"
              label="complemento"
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
                value: user.address?.complement,
                onChange: onChangeField("address.complement"),
              })}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextFieldComponent
              variant="outlined"
              label="Nr casa"
              placeholder="Nr Casa"
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
                value: user.address?.house_number,
                onChange: onChangeField("address.house_number"),
              })}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectComponent
              fullWidth
              label="País"
              value={user.address.country}
              defaultValue={user.address.country}
              {...register("address.country", {
                required: { value: true, message: "Campo obrigatório" },
              })}
              onChange={onChangeField("address.country")}
              options={paises.map(pais => ({
                value: `${pais.id}`,
                label: pais.name,
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
              value={user.address.state}
              defaultValue={user.address.state}
              {...register("address.state", {
                required: { value: true, message: "Campo obrigatório" },
              })}
              onChange={onChangeField("address.state")}
              options={estados.map(estado => ({
                value: `${estado.id}`,
                label: estado.name,
              }))}
              erro={errors?.address?.state?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectComponent
              fullWidth
              label="Cidade"
              value={user.address.city}
              defaultValue={user.address.city}
              {...register("address.city", {
                required: { value: true, message: "Campo obrigatório" },
              })}
              onChange={onChangeField("address.city")}
              options={cidades.map(cidade => ({
                value: `${cidade.id}`,
                label: cidade.name,
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
          onClick={handleSubmit(editarUsuario)}
          className="botao-enviar">
          Editar
        </Button>
      </Box>
    </Card>
  );
}

export default EditFormUsuario;
