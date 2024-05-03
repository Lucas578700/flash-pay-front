import styled from 'styled-components';

const RootContainer = styled.div`
  display: flex;
  flex: 1;
`;

const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 8px;
  ${props => props.theme.mixins.toolbar};
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
`;

export { RootContainer, ToolbarContainer, ContentContainer };
