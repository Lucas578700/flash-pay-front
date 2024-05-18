import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  height: 100vh;
`;

export const Content = styled.div`
  gap: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  box-shadow: 0 1px 2px #0003;
  background-color: white;
  max-width: 350px;
  padding: 20px;
  border-radius: 5px;
`;

export const img = styled.img`
width: 30%;
`;

export const Input = styled.input`
padding: 12px 30px;
text-align: left;
max-width: 100%;
`

export const Button = styled.button`
  background: linear-gradient(90deg, #5125b0 20%, #535bf2 60%, rgba(24, 83, 169, 1) 100%);
  color: white;
  padding: 13px 90px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: darkblue;
  }

  &:focus {
    outline: none;
  }
`;

export const Label = styled.label`
  font-size: 30px;
  font-weight: 600;
  color: #fff;
`;

export const LabelSignup = styled.label`
  font-size: 16px;
  color: #fff;
`;

export const labelError = styled.label`
  font-size: 14px;
  color: red;
`;

export const Strong = styled.strong`
  cursor: pointer;

  a {
    text-decoration: none;
    color: #00B2FF;
  }
`;

export const Title = styled.label`
font-size: 42px;
color: white;
text-align: center;
margin-bottom: 100px;
font-weight: 600;
font-family: 'Krona one', sans-serif;
`;

export const Title2 = styled.label`
    margin: 0;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 600;
    font-size: 45px !important;
    line-height: 1.235;
    letter-spacing: 0.00735em;
    color: #5125b0;
`;



