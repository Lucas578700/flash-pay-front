import { FC, forwardRef } from "react";
import TextField from "@mui/material/TextField";

const TextFieldComponent = forwardRef(
  (
    {
      variant = "outlined",
      name,
      erro,
      fullWidth = true,
      margin = "normal",
      ...props
    },
    ref
  ) => (
    <TextField
      ref={ref}
      id={`id-${name}`}
      name={name}
      fullWidth={fullWidth}
      variant={variant}
      error={!!erro}
      helperText={erro}
      margin={margin}
      {...props}
    />
  )
);

export default TextFieldComponent;
