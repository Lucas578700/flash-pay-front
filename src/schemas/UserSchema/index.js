import * as yup from "yup";

import {
    cepRegex,
    cpfCnpjRegex,
    emailRegex,
    passwordRegex,
} from "src/functions/ValidatorsRegex";

const enderecoSchema = yup.object().shape({
  cep: yup
    .string()
    .matches(cepRegex, "CEP inválido")
    .required("CEP é obrigatório"),
  bairro: yup.string(),
  logradouro: yup.string().required("Logradouro é obrigatório"),
  nr_casa: yup.number(),
  complemento: yup.string(),
  cidade: yup.string().required("Cidade é obrigatória"),
  estado: yup.string().required("Estado é obrigatório"),
  pais: yup.string().required("País é obrigatório"),
});

const userSchema = yup.object().shape({
  nome_completo: yup.string().required("Nome é obrigatório"),
  email: yup
    .string()
    .matches(emailRegex, "E-mail inválido")
    .required("E-mail é obrigatório"),
  password: yup
    .string()
    .matches(passwordRegex, "Senha inválida")
    .required("Senha é obrigatória"),

  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "As senhas não coincidem")
    .matches(passwordRegex, "Senha inválida")
    .required("Senha é obrigatória"),
  data_nascimento: yup.date().required("A data de nascimento é obrigatória"),
  cpf_cnpj: yup
    .string()
    .matches(cpfCnpjRegex, "CPF/CNPJ é inválido")
    .required("CPF/CNPJ é obrigatório"),
  telefone: yup.string(),
  rg: yup.string(),
  endereco: enderecoSchema.required("Endereço é obrigatório"),  
});

export default userSchema;
