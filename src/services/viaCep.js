import axios from "axios";

const apiViaCep = axios.create({
  baseURL: "https://viacep.com.br/ws/",
  headers: {"Access-Control-Allow-Origin": "json"}
});

export { apiViaCep };
