import { Route } from "react-router-dom";
import SignIn from "src/pages/SignIn";
import SignUp from "src/pages/SignUp";
import Home from "src/pages/Home";
import Produtos from "src/pages/ProdutosSite";

const SiteRoutes = [
  <Route index element={<Home />} key="home" />,
  <Route path="/produtos/:id" element={<Produtos />} key="produtos" />,
  <Route path="/login" element = {<SignIn />} key="signin" />,
  <Route path="/registrar-me" element = {<SignUp />} key="signup" />,
];

export default SiteRoutes;
