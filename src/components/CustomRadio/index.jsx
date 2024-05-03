/* eslint-disable @typescript-eslint/no-explicit-any */
import Grid from "@mui/material/Grid";
import { Typography, Box } from "@mui/material";

import { Elemento } from "./styles";

function CustomRadio({ options, value, onChange, label }) {
  return (
    <Box
      sx={{
        marginTop: 2,
        marginBottom: 2,
      }}>
      <Typography variant="subtitle1">{label}</Typography>
      <Grid container spacing={2} flexDirection="row" alignItems="flex-start">
        {options.map(option => (
          <Grid item key={String(option.value)}>
            <Elemento
              ativo={value === option.value}
              onClick={() => {
                onChange(option.value);
              }}>
              {option.label}
            </Elemento>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default CustomRadio;
