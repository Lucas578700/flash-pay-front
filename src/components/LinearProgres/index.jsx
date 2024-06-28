import { StyledRoot, StyledLinearProgres } from "./styles";

function LinearLoader(props) {
  const { loading = false, ...rest } = props;

  if (!loading) {
    rest.variant = "determinate";
  }

  return (
    <StyledRoot>
      <StyledLinearProgres
        color="primary"
        loading={loading ? "true" : "false"}
        {...rest}
      />
    </StyledRoot>
  );
}

export default LinearLoader;
