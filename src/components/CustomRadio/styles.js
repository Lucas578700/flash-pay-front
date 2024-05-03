import styled from 'styled-components';

const DivPrincipal = styled.div`
  margin: 2px;
  border-radius: 4px;
  border-width: 1px;
  border-style: solid;
  border-color: black;
`;

const Elemento = styled.div<{ ativo?: boolean }>`
  padding: 8px 16px;
  height: 40px;
  border-radius: 6px;
  border-width: 2px;
  border-style: solid;
  border-color: ${props => (props.ativo ? 'rgba(97, 170, 255, 0.12)' : 'rgba(97, 170, 255, 0.5)')};
  cursor: pointer;
  font-weight: ${props => (props.ativo ? 600 : 500)};
  font-size: 14px;
  text-align: center;
  background-color: ${props => (props.ativo ? 'rgba(97, 170, 255, 0.12)' : '#fff')};
  color: ${props => (props.ativo ? '#0E778F' : '#000')};
  text-decoration: ${props => (props.ativo ? 'underline' : 'none')};
`;

export { DivPrincipal, Elemento };
