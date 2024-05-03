import { Route } from "react-router-dom";
import DashBoard from "src/pages/DashBoard";
import Perfil from "src/pages/Perfil";

const PainelRoutes = [
  // exemplo depois remove
  <Route
    index
    element={<DashBoard />}
    key="list-dashboard"
  />,
  // <Route
  //   path="predio/cadastrar"
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
