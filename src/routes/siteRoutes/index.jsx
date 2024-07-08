import { Route } from "react-router-dom";
import SignIn from "src/pages/SignIn";
import SignUp from "src/pages/SignUp";
import Home from "src/pages/Home";
import Produtos from "src/pages/ProdutosSite";
// import Detalhes from "src/pages/ProdutosSite/detalhes";

const SiteRoutes = [
  <Route index element={<Home />} key="home" />,
  <Route path="/produtos/:id" element={<Produtos />} key="produtos" />,
  // <Route path="/produtos/:id/detalhes/:id" element={<Detalhes />} key="detalhes" />,
  <Route path="/login" element = {<SignIn />} key="signin" />,
  <Route path="/registrar-me" element = {<SignUp />} key="signup" />,
];

export default SiteRoutes;
