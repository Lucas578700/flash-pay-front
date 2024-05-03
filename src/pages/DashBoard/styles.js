import { Card, CardActions, CardContent, CardHeader } from "@mui/material";
import styled from "styled-components";

export const CardItem = styled(Card)`
  border-radius: 10px;
  padding: 0;
`;

export const CardItemHeader = styled(CardHeader)`
  background-color: rgba(14, 119, 143, 0.3);
`;

export const CardItemContent = styled(CardContent)`
  //background-color: #132c3b;
  padding: 10px;
`;

export const CardItemActions = styled(CardActions)`
  justify-content: center;
`;
