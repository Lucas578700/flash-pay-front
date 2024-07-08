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
  street: yup.string().required("Bairro é obrigatório"),
  neighborhood: yup.string(),
  house_number: yup.number(),
  complement: yup.string(),
  city: yup.string().required("Cidade é obrigatória"),
  state: yup.string().required("Estado é obrigatório"),
  country: yup.string().required("País é obrigatório"),
});

const userSchema = yup.object().shape({
  full_name: yup.string().required("Nome é obrigatório"),
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
  birth_date: yup.date().required("A data de nascimento é obrigatória"),
  cpf_cnpj: yup
    .string()
    .matches(cpfCnpjRegex, "CPF/CNPJ é inválido")
    .required("CPF/CNPJ é obrigatório"),
  telephone: yup.string(),
  rg: yup.string(),
  address: enderecoSchema.required("Endereço é obrigatório"),  
});

export default userSchema;
