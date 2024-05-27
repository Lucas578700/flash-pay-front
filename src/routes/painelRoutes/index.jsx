import { Route } from "react-router-dom";
import DashBoard from "src/pages/DashBoard";
import Perfil from "src/pages/Perfil";

import ListaProdutos from "../../pages/Produtos/Listagem";
import ListaUniversidade from "../../pages/University/Listagem";

const PainelRoutes = [
  // exemplo depois remove
  <Route
    index
    element={<DashBoard />}
    key="list-dashboard"
  />,
  <Route
    path="produto"
    element={<ListaProdutos />}
    key="lista-produtos"
  />,
  <Route
    path="universidade"
    element={<ListaUniversidade />}
    key="lista-universidade"
  />,
  // <Route
  //   path="produto/cadastrar"
  //   element={<FormPredio />}
  //   key="create-building"
  // />,
  // <Route
  //   path="predio/editar/:id"
  //   element={<EditFormPredio />}
  //   key="edit-building"
  // />,
  // <Route path="predio" element={<ListaPredios />} key="list-buildings" />,
  <Route
    path="perfil"
    element={<Perfil />}
    key="perfil"
  />,
];

export default PainelRoutes;
