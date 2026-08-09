import { TextField, type TextFieldProps } from "@mui/material";

type AppInputProps = TextFieldProps;

function AppInput({ fullWidth = true, margin = "normal", ...props }: AppInputProps) {
  return (
    <TextField
      {...props}
      className={`glass-input ${props.className ?? ""}`.trim()}
      fullWidth={fullWidth}
      margin={margin}
    />
  );
}

export default AppInput;
