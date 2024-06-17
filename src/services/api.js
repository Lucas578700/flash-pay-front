import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

const routes = {
  user: "user/",
  pais: "address/country/",
  estado: "address/estado/",
  cidade: "address/cidade/",
  university: "core/university/",
  shoppe: "core/shoppe/",
  //product: "product/product"
};


export { api, routes };
