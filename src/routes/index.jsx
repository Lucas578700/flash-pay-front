import { Fragment } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";


const RoutesApp = () => {
    return (
        <BrowserRouter>
        <Fragment>
            <Routes>
                <Route path="/" element = {<SignIn />} />
                <Route path="/signup" element = {<SignUp />} />
            </Routes>
        </Fragment>
        </BrowserRouter>
    );
}

export default RoutesApp