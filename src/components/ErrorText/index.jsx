import Typography from "@mui/material/Typography";
import { Colors } from "../../utils/colors";

const ErrorText = ({ children }) => {
  return (
    <Typography
      variant="subtitle2"
      color={Colors.error}
      fontSize={12}
      fontFamily={"Poppins"}
      textAlign="left"
    >
      {children}
    </Typography>
  );
};

export default ErrorText;
