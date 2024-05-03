import { forwardRef } from 'react';
import MaskedInput from "react-input-mask";

const MaskedInputComponent = forwardRef((props, ref) => {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        if (typeof inputRef === "function") {
          inputRef(ref ? ref.inputElement : null);
        }
      }}
    />
  );
});

export default MaskedInputComponent;
