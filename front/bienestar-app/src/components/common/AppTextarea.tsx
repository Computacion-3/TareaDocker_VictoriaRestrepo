import AppInput from "./AppInput";
import type { TextFieldProps } from "@mui/material";

type AppTextareaProps = TextFieldProps;

function AppTextarea({ minRows = 4, ...props }: AppTextareaProps) {
  return (
    <AppInput
      {...props}
      multiline
      minRows={minRows}
    />
  );
}

export default AppTextarea;
