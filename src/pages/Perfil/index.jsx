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
import LinearLoader from "src/components/LinearProgress";
import formatDate from "src/functions/FormatDate";
import setNestedValue from "src/functions/SetNestedValue";
import userSchema from "src/schemas/UserSchema";
import { apiViaCep } from "src/services/viaCep";
import { useAuth } from "../../hooks/AuthContext";

const initialState = {
  nome_completo: "",
  email: "",
  password: "",
  confirm_password: "",
  data_nascimento: new Date("01-01-1998"),
  cpf_cnpj: "",
  telefone: "",
  rg: "",
  foto: "",
  endereco: {
    cep: "",
    bairro: "",
    logradouro: "",
    nr_casa: 0,
    complemento: "",
    cidade: "",
    estado: "",
    pais: "",
  },
  cursos: [],
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
    (name) => (e) => {
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
          api.get(`${routes.pais}`),
          api.get(`${routes.estado}`),
          api.get(`${routes.cidade}?limit=5570`),
          api.get(`${routes.user}${user.id}/`),
        ]);

      setPaises(paisResponse.data.results || []);
      setEstados(estadoResponse.data.results || []);
      setCidades(cidadeResponse.data.results || []);

      const { data_nascimento, endereco, ...user_change } =
        userResponse.data || {};

      const data_format = dayjs(data_nascimento).format("DD-MM-YYYY");
      setUser({
        ...user_change,
        data_nascimento: new Date(data_format),
        endereco: {
          ...endereco,
          pais: endereco.pais.id,
          estado: endereco.estado.id,
          cidade: endereco.cidade.id,
        },
      });

      setLoading(false);
    } catch (e) {
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

  const checkCep = async (e) => {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length === 8) {
      await searchCep(cep);
    }
  };

  const searchCep = useCallback(
    async (cep) => {
      try {
        const {
          data: { bairro, complemento, logradouro, localidade, uf },
        } = await apiViaCep.get(`${cep}/json/`);

        const pais =
          paises.find(pais => pais.nome === "Brasil")?.id.toString() ?? "";

        const estado =
          estados.find(estado => estado.nome.includes(uf))?.id.toString() ?? "";

        const cidade =
          cidades
            .find(cidade => cidade.nome.includes(localidade))
            ?.id.toString() ?? "";

        setValue("endereco.cep", cepMask(cep));
        setValue("endereco.pais", pais);
        setValue("endereco.cidade", cidade);
        setValue("endereco.estado", estado);
        setValue(
          "endereco.logradouro",
          logradouro || usuario.endereco.logradouro
        );
        setValue("endereco.bairro", bairro || usuario.endereco.bairro);
        setValue(
          "endereco.complemento",
          complemento || usuario.endereco.complemento
        );

        setUser(prevUsuario => ({
          ...prevUsuario,
          endereco: {
            ...prevUsuario.endereco,
            cep: cepMask(cep),
            logradouro: logradouro || usuario.endereco.logradouro,
            bairro: bairro || usuario.endereco.bairro,
            complemento: complemento || usuario.endereco.complemento,
            pais: pais,
            estado: estado,
            cidade: cidade,
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
    const { data_nascimento, telefone, endereco, ...userChange } = usuario;

    return {
      ...userChange,
      data_nascimento: formatDate(data_nascimento),
      telefone: telefone ? telefone.replace(/\D/g, "") : "",
      endereco: {
        ...endereco,
        cep: endereco.cep.replace(/\D/g, ""),
      },
    };
  }

  const editarUser = useCallback(async () => {
    const user_save = formatUser();

    const url = urlUser;

    try {
      await api.put(`${url}${user.origem_id}/`, user_save);
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
              Nome: {usuario?.nome_completo || "Usuário sem nome"}
            </Typography>
            <Typography>E-mail: {usuario.email}</Typography>
            <Typography>Telefone: {usuario?.telefone}</Typography>
            <Typography>
              Data de Nascimento:{" "}
              {dayjs(usuario.data_nascimento).format("DD/MM/YYYY")}
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
              erro={errors?.nome_completo?.message}
              margin="normal"
              required
              inputProps={{ maxLength: 50 }}
              {...register("nome_completo", {
                required: { value: true, message: "Campo obrigatório" },
                minLength: {
                  value: 2,
                  message: "No minimo 2 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "No máximo 50 caracteres",
                },
                value: usuario.nome_completo,
                onChange: onChangeField("nome_completo"),
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
              value={cpfCnpjMask(usuario.cpf_cnpj)}
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
                name="data_nascimento"
                control={control}
                defaultValue={usuario.data_nascimento}
                render={({ field, fieldState: { error } }) => (
                  <DatePickerComponent
                    field={field}
                    label="Data de nascimento"
                    error={error}
                    {...register("data_nascimento", {
                      required: {
                        value: true,
                        message: "Campo obrigatório",
                      },
                      value: usuario.data_nascimento,
                      onChange: onChangeField("data_nascimento"),
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
              erro={errors?.telefone?.message}
              margin="normal"
              InputProps={{
                inputComponent: MaskedInputComponent,
                inputProps: {
                  mask: "99 9 9999 9999",
                },
              }}
              {...register("telefone", {
                required: { value: true, message: "Campo obrigatório" },
                minLength: {
                  value: 2,
                  message: "No minimo 2 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "No máximo 50 caracteres",
                },
                value: usuario.telefone,
                onChange: onChangeField("telefone"),
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
              erro={errors?.endereco?.cep?.message}
              margin="normal"
              required
              InputProps={{
                inputComponent: MaskedInputComponent,
                inputProps: {
                  value: usuario.endereco.cep,
                  mask: "99999-999",
                },
              }}
              {...register("endereco.cep", {
                required: { value: true, message: "Campo obrigatório" },
                minLength: {
                  value: 8,
                  message: "No minimo 8 caracteres",
                },
                maxLength: {
                  value: 8,
                  message: "No máximo 8 caracteres",
                },
                onChange: onChangeField("endereco.cep"),
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
              placeholder="Bairro do usuario"
              erro={errors?.endereco?.bairro?.message}
              margin="normal"
              inputProps={{ maxLength: 50 }}
              {...register("endereco.bairro", {
                minLength: {
                  value: 2,
                  message: "No minimo 8 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "No máximo 50 caracteres",
                },
                value: usuario.endereco.bairro,
                onChange: onChangeField("endereco.bairro"),
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
              erro={errors?.endereco?.logradouro?.message}
              margin="normal"
              required
              inputProps={{ maxLength: 50 }}
              {...register("endereco.logradouro", {
                required: { value: true, message: "Campo obrigatório" },
                minLength: {
                  value: 2,
                  message: "No minimo 8 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "No máximo 50 caracteres",
                },
                value: usuario.endereco.logradouro,
                onChange: onChangeField("endereco.logradouro"),
              })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextFieldComponent
              variant="outlined"
              label="complemento"
              placeholder="Complemento"
              erro={errors?.endereco?.complemento?.message}
              margin="normal"
              inputProps={{ maxLength: 50 }}
              {...register("endereco.complemento", {
                required: { value: true, message: "Campo obrigatório" },
                minLength: {
                  value: 2,
                  message: "No minimo 8 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "No máximo 50 caracteres",
                },
                value: usuario.endereco.complemento,
                onChange: onChangeField("endereco.complemento"),
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
              erro={errors?.endereco?.nr_casa?.message}
              margin="normal"
              type="number"
              inputProps={{ maxLength: 50 }}
              {...register("endereco.nr_casa", {
                minLength: {
                  value: 2,
                  message: "No minimo 8 caracteres",
                },
                maxLength: {
                  value: 6,
                  message: "No máximo 50 caracteres",
                },
                value: usuario.endereco.nr_casa,
                onChange: onChangeField("endereco.nr_casa"),
              })}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectComponent
              fullWidth
              label="País"
              value={usuario.endereco.pais}
              defaultValue={usuario.endereco.pais}
              {...register("endereco.pais", {
                required: { value: true, message: "Campo obrigatório" },
              })}
              onChange={onChangeField("endereco.pais")}
              options={paises.map(pais => ({
                value: `${pais.id}`,
                label: pais.nome,
              }))}
              erro={errors?.endereco?.pais?.message}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <SelectComponent
              fullWidth
              label="Estado"
              value={usuario.endereco.estado}
              defaultValue={usuario.endereco.estado}
              {...register("endereco.estado", {
                required: { value: true, message: "Campo obrigatório" },
              })}
              onChange={onChangeField("endereco.estado")}
              options={estados.map(estado => ({
                value: `${estado.id}`,
                label: estado.nome,
              }))}
              erro={errors?.endereco?.estado?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectComponent
              fullWidth
              label="Cidade"
              value={usuario.endereco.cidade}
              defaultValue={usuario.endereco.cidade}
              {...register("endereco.cidade", {
                required: { value: true, message: "Campo obrigatório" },
              })}
              onChange={onChangeField("endereco.cidade")}
              options={cidades.map(cidade => ({
                value: `${cidade.id}`,
                label: cidade.nome,
              }))}
              erro={errors?.endereco?.cidade?.message}
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
