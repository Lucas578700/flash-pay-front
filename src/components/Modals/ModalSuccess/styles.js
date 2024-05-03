import Typography from "@mui/material/Typography";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0%;
  padding: 0;
`;

export const HeaderText = styled(Typography)`
  font-size: 1.1rem;
  font-weight: bold;
  text-align: center;
  padding-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const MainText = styled(Typography)`
  text-align: center;
  font-size: 0.9rem;
  margin: 22px 0 15px;
`;
