import styled from 'styled-components';
import Button from '@mui/material/Button';

export const Root = styled.div`
  width: 100%;
`;

export const HeaderTable = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
`;

export const StyledButton = styled(Button)`
  white-space: nowrap;
`;

export const ButtonAddNew = styled(StyledButton)`
  margin-right: 50px;
`;

export const ButtonImport = styled(StyledButton)``;

export const ButtonFilterData = styled(StyledButton)``;

export const ButtonDownload = styled(StyledButton)`
  margin-right: 8px;
`;

export const ButtonGoBack = styled(StyledButton)`
  margin-right: 10px;
`;
