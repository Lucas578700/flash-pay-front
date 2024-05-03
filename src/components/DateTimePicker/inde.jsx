import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ptBrLocale from "date-fns/locale/pt-BR";
import React from "react";

const DateTimePickerComponent = React.forwardRef(
  ({ label, field, error = "" }, ref) => {
    return (
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={ptBrLocale}
      >
        <DateTimePicker
          {...field}
          label={label}
          ref={ref}
          slotProps={{
            textField: {
              fullWidth: true,
              variant: "outlined",
              error: !!error,
              helperText: error?.message,
            },
          }}
        />
      </LocalizationProvider>
    );
  }
);

export default DateTimePickerComponent;
