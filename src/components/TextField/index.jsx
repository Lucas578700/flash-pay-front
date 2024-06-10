import { forwardRef } from "react";
import TextField from "@mui/material/TextField";
import PropTypes from 'prop-types';

const TextFieldComponent = forwardRef(
  (
    {
      variant = "outlined",
      name,
      error,
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
      error={error}
      margin={margin}
      {...props}
    />
  )
);

TextFieldComponent.displayName = 'TextFieldComponent';

TextFieldComponent.propTypes = {
  variant: PropTypes.oneOf(['filled', 'outlined', 'standard']),
  name: PropTypes.string.isRequired,
  error: PropTypes.bool,
  fullWidth: PropTypes.bool,
  margin: PropTypes.oneOf(['none', 'dense', 'normal']),
};

export default TextFieldComponent;
