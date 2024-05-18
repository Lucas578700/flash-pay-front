import * as Yup from "yup";

const CadastroSchema = Yup.object().shape({
  full_name: Yup.string().required("Campo obrigatório"),
  email: Yup.string()
    .email("Digite um e-mail válido")
    .required("Campo obrigatório"),
  birth_date: Yup.string().required("Campo obrigatório"),
  telephone: Yup.string().required("Campo obrigatório"),
  rg: Yup.string().required("Campo obrigatório"),
  cpf_cnpj: Yup.string().required("Campo obrigatório"),
  password: Yup.string().required("Campo obrigatório"),
});

export default CadastroSchema;
