import React, { useCallback, useEffect, useState } from "react";
import { AuthContext } from "src/hooks/AuthContext";
import useAPIError from "src/hooks/useAPIError";
import { api, routes } from "../../services/api";

import LinearLoader from "src/components/LinearProgres";
import formatDate from "src/functions/FormatDate";
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

  const signUp = async (data) => {
    const usersStorage = JSON.parse(localStorage.getItem("@user"));

    const hasUser = usersStorage?.filter(user => user.email === data.email);

    if (hasUser?.length) {
      return "Já tem uma conta com esse E-mail";
    }

    try {
      await api.post(`${routes.user}`, {
        ...data,
        birth_date: formatDate(data.birth_date),
      });
    } catch (e) {
      addError(extractErrorDetails(e), e.response.status);
    }

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
      value={{
        user: data?.user,
        loading: loadingAuth,
        signIn,
        signOut,
        signUp,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
