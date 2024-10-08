import { Route } from "react-router-dom";
import DashBoard from "src/pages/DashBoard";
import Perfil from "src/pages/Perfil";

import ListaProdutos from "../../pages/Produtos/Listagem";
import ListaUniversidade from "../../pages/University/Listagem";
import ListaEstabelecimento from "../../pages/Estabelecimentos/Listagem";
import FormUniversity from "../../pages/University/Form";
import EditFormUniversity from "../../pages/University/EditForm";
import FormEstabelecimento from "../../pages/Estabelecimentos/Form";
import EditFormEstabelecimento from "../../pages/Estabelecimentos/EditForm";
import FormProdutos from "../../pages/Produtos/Form";
import FormCategory from "../../pages/Category/Form";
import EditFormCategory from "../../pages/Category/EditForm";
import ListCategory from "../../pages/Category/Listagem";
import EditFormProduct from "../../pages/Produtos/EditForm";
import ListaUsuario from "../../pages/Usuarios/Listagem";
import FormUsuario from "../../pages/Usuarios/Form";
import EditFormUsuario from "../../pages/Usuarios/EditForm";

const PainelRoutes = [
  <Route
    path="universidade/cadastrar"
    element={<FormUniversity />}
    key="create-university"
  />,
  <Route
    path="universidade/editar/:id"
    element={<EditFormUniversity />}
    key="edit-university"
  />,
  <Route index element={<DashBoard />} key="list-dashboard" />,
  <Route
    path="universidade"
    element={<ListaUniversidade />}
    key="lista-universidade"
  />,
  <Route
    path="estabelecimento"
    element={<ListaEstabelecimento />}
    key="lista-estabelecimento"
  />,
  <Route
    path="estabelecimento/cadastrar"
    element={<FormEstabelecimento />}
    key="create-shoppe"
  />,
  <Route
    path="estabelecimento/editar/:id"
    element={<EditFormEstabelecimento />}
    key="edit-shoppe"
  />,
  <Route path="categoria" element={<ListCategory />} key="list-category" />,
  <Route
    path="categoria/cadastrar"
    element={<FormCategory />}
    key="create-category"
  />,
  <Route
    path="categoria/editar/:id"
    element={<EditFormCategory />}
    key="edit-category"
  />,
  <Route path="produto" element={<ListaProdutos />} key="lista-produtos" />,
  <Route
    path="produto/cadastrar"
    element={<FormProdutos />}
    key="create-product"
  />,
  <Route
    path="produto/editar/:id"
    element={<EditFormProduct />}
    key="edit-product"
  />,
  <Route path="usuario" element={<ListaUsuario />} key="lista-usuario" />,
  <Route
    path="usuario/cadastrar"
    element={<FormUsuario />}
    key="create-usuario"
  />,
  <Route
    path="usuario/editar/:id"
    element={<EditFormUsuario />}
    key="edit-user"
  />,
  <Route path="perfil" element={<Perfil />} key="perfil" />,
];

export default PainelRoutes;
