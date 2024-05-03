import { useState } from "react";
import * as C from "./styles";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import Logo from "../../assets/logo.png";

const Signup = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [adress, setAdress] = useState("");
  const [error, setError] = useState("");

  const handleSignup = () => {
    if (!fullname | !email | !senha | !cellphone | !adress) {
      setError("Preencha todos os campos");
      return;
    }

    const res = signUp(fullname, email, senha, cellphone, adress);

    if (res) {
      setError(res);
      return;
    }

    navigate("/home");
  };

  return (
    <C.Container>
      <C.Logo src={Logo} alt="Logo Flash Pay" />
      <C.Title>FlashPay</C.Title>
      <C.Label>Cadastre-se</C.Label>
      <C.Input
        type="text"
        placeholder="Digite seu Nome Completo"
        value={fullname}
        onChange={e => [setFullname(e.target.value), setError("")]}
      />
      <C.Input
        type="email"
        placeholder="Digite seu E-mail"
        value={email}
        onChange={e => [setEmail(e.target.value), setError("")]}
      />
      <C.Input
        type="password"
        placeholder="Digite sua Senha"
        value={senha}
        onChange={e => [setSenha(e.target.value), setError("")]}
      />
      <C.Input
        type="telephone"
        placeholder="Digite seu telefone"
        value={cellphone}
        onChange={e => [setCellphone(e.target.value), setError("")]}
      />
      <C.Input
        type="text"
        placeholder="Digite seu Endereço"
        value={adress}
        onChange={e => [setAdress(e.target.value), setError("")]}
      />
      <C.labelError>{error}</C.labelError>
      <C.Button Text="Entrar" onClick={handleSignup}>
        Entrar
      </C.Button>
      {/* <C.LabelSignup>
          Não tem uma conta?
          <C.Strong>
            <Link to="/signup">&nbsp;Registre-se</Link>
          </C.Strong>
        </C.LabelSignup> */}
    </C.Container>
  );
};

export default Signup;
