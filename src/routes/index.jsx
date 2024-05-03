import { Suspense } from "react";
import { BrowserRouter, Route, Routes as RoutesRouter } from "react-router-dom";
import NotFound from "src/pages/NotFound";

import Content from "../components/Content";
import Loader from "../components/Loader";
import UserRoute from "./UserRoute";

import PainelRoutes from "./painelRoutes";
import SiteRoutes from "./siteRoutes";

function Routes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader open />}>
        <RoutesRouter>
          <Route path="/" element={<Content />}>
            {SiteRoutes}
          </Route>
          <Route path="/painel" element={<UserRoute />}>
            {PainelRoutes}
          </Route>
          <Route path="*" element={<NotFound />} />
        </RoutesRouter>
      </Suspense>
    </BrowserRouter>
  );
}

export default Routes;
