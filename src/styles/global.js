import { createGlobalStyle } from "styled-components";



const GlobalStyle = createGlobalStyle`

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    width: 100vw;
    height: 100vh;
    background-image: linear-gradient(#5125B0, #AD11B0);
    font-family: 'Krona one', sans-serif;
    color: black;
  }
`;

export default GlobalStyle;