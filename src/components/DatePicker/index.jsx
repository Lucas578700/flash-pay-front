import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ptBrLocale from "date-fns/locale/pt-BR";
import React from "react";

const DatePickerComponent = React.forwardRef(
  ({ label, error, helperText, field }, ref) => {
    return (
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={ptBrLocale}>
        <DatePicker
          {...field}
          label={label}
          ref={ref}
          defaultValue={new Date("1998-1-1")}
          slotProps={{
            textField: {
              fullWidth: true,
              variant: "outlined",
              error: error,
              helperText: helperText,
            },
          }}
        />
      </LocalizationProvider>
    );
  }
);

// Add the display name
DatePickerComponent.displayName = "DatePickerComponent";

export default DatePickerComponent;
