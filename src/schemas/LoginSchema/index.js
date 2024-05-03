import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Digite um e-mail válido")
    .required("Campo obrigatório"),
  password: Yup.string().required("Campo obrigatório"),
});

export default LoginSchema;
