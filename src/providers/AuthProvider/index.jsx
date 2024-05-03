import React, { useCallback, useEffect, useState } from "react";
import { AuthContext } from "src/hooks/AuthContext";
import useAPIError from "src/hooks/useAPIError";
import { api } from "../../services/api";

import LinearLoader from "src/components/LinearProgress";
import extractErrorDetails from "src/utils/extractErrorDetails";

export const AuthProvider = ({ children }) => {
  const { addError } = useAPIError();
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [data, setData] = useState(null);

  const initializeAuth = async () => {
    setLoadingAuth(true);
    const token = await localStorage.getItem("@authToken");
    const user = await localStorage.getItem("@user");

    setLoadingAuth(false);

    if (token && user) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setData({ token, user: JSON.parse(user) });
    }

    return {};
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    try {
      setLoadingAuth(true);

      const {
        data: { access, user },
      } = await api.post("login/", { email, password });

      api.defaults.headers.common["Authorization"] = `Bearer ${access}`;
      localStorage.setItem("@authToken", access);
      localStorage.setItem("@user", JSON.stringify(user));

      setData({ token: access, user });
    } catch (err) {
      addError(extractErrorDetails(err), err.response.status);
    }
    setLoadingAuth(false);
  }, []);

  const signUp = (fullname, email, password, cellphone, adress) => {
    const usersStorage = JSON.parse(localStorage.getItem("users_bd"));

    const hasUser = usersStorage?.filter((user) => user.email === email);

    if (hasUser?.length) {
      return "Já tem uma conta com esse E-mail";
    }

    let newUser;

    if (usersStorage) {
      newUser = [...usersStorage, { fullname, email, password, cellphone, adress }];
    } else {
      newUser = [{ fullname, email, password, cellphone, adress }];
    }

    localStorage.setItem("users_bd", JSON.stringify(newUser));

    return;
  };

  const signOut = useCallback(() => {
    setLoadingAuth(true);

    api.post("logout/");

    localStorage.removeItem("@authToken");
    localStorage.removeItem("@user");

    setData({});

    setLoadingAuth(false);
  }, []);

  if (loadingAuth) {
    return <LinearLoader loading={loadingAuth} />;
  }

  return (
    <AuthContext.Provider
      value={{ user: data?.user, loading: loadingAuth, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};
