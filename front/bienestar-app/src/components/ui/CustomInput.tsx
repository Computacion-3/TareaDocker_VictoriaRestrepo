import { TextField, type TextFieldProps } from "@mui/material";

interface CustomInputProps {
  label: string;
  value: string;
  onChange: TextFieldProps["onChange"];
  type?: TextFieldProps["type"];
}

function CustomInput({
  label,
  value,
  onChange,
  type = "text"
}: CustomInputProps) {
  return (
    <TextField
      fullWidth
      margin="normal"
      label={label}
      value={value}
      type={type}
      onChange={onChange}
    />
  );
}

export default CustomInput;
