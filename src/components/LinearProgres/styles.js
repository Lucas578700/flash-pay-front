import styled from 'styled-components';
import LinearProgress from "@mui/material/LinearProgress";

export const StyledRoot = styled.div`
  width: 100%;
`;

export const StyledLinearProgres = styled(LinearProgress)`
  height: ${(props) => (props.loading ? "true" && '4px' : '0')};
`;

