import * as Yup from "yup";

import {
  cpfCnpjRegex,
  emailRegex,
  passwordRegex,
} from "src/functions/ValidatorsRegex";

const CadastroSchema = Yup.object().shape({
  full_name: Yup.string().required("Campo obrigatório"),
  email: Yup
    .string()
    .matches(emailRegex, "E-mail inválido")
    .required("E-mail é obrigatório"),
  birth_date: Yup.string().required("Campo obrigatório"),
  telephone: Yup.string().required("Campo obrigatório"),
  rg: Yup.string().required("Campo obrigatório"),
  cpf_cnpj: Yup
    .string()
    .matches(cpfCnpjRegex, "CPF/CNPJ é inválido")
    .required("CPF/CNPJ é obrigatório"),
  password: Yup
    .string()
    .matches(passwordRegex, "Senha inválida")
    .required("Senha é obrigatória"),
});

export default CadastroSchema;
