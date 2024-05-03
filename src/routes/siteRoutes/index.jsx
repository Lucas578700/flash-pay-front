import { Route } from "react-router-dom";
import SignIn from "src/pages/SignIn";
import SignUp from "src/pages/SignUp";
import Home from "src/pages/Home";

const SiteRoutes = [
  <Route index element={<Home />} key="home" />,
  <Route path="/login" element = {<SignIn />} key="signin" />,
  <Route path="/signup" element = {<SignUp />} key="signup" />,
];

export default SiteRoutes;
