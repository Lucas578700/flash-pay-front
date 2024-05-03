import styled from "styled-components";

const MuiDialogPaper = styled.div`
  .MuiDialog-paper {
    border-radius: 25px;
  }
`;

const BorderPaper = styled.div`
  border-width: 5px;
  border-style: solid;
`;

const ContentText = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  & p {
    margin-bottom: 5px;
  }
`;

const DialogCenter = styled.div`
  align-items: center;
  justify-content: center;
`;

const UseHeaderStyle = styled.div`
  .closeIcon {
    margin: 5px;
  }

  .fullScreenIcon {
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .header {
    display: inline-flex;
    flex: 0 0 auto;
    justify-content: space-between;
    align-items: flex-start;
  }

  .title {
    flex: auto !important;
    padding-bottom: 10px;
    min-width: 150px;
  }
`;

export {
  MuiDialogPaper,
  BorderPaper,
  ContentText,
  DialogCenter,
  UseHeaderStyle,
};
