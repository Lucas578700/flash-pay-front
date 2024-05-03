import { FC, forwardRef, ReactNode } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";

const TextFieldComponent = forwardRef(
  ({ fullWidth, label, options, erro, name, ...props }, ref) => {
    const renderItem = ({
      value,
      label: lebalOption,
      disabled = false,
    }) => (
      <MenuItem key={value} disabled={disabled} value={value}>
        {lebalOption}
      </MenuItem>
    );
    return (
      <FormControl fullWidth={fullWidth} margin="normal" error={!!erro}>
        <InputLabel id={`id-${name}-label`}>{label}</InputLabel>
        <Select
          ref={ref}
          labelId={`id-${name}-label`}
          id={`id-${name}`}
          label={label}
          {...props}>
          {options.map(option => renderItem(option))}
        </Select>
        {erro && <FormHelperText>{erro}</FormHelperText>}
      </FormControl>
    );
  }
);

export default TextFieldComponent;
