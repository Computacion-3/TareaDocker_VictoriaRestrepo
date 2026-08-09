import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";

export interface SelectOption {
  label: string;
  value: string;
}

interface AppSelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (event: SelectChangeEvent<string>) => void;
  helperText?: string;
}

function AppSelect({
  label,
  value,
  options,
  onChange,
  helperText,
}: AppSelectProps) {
  return (
    <FormControl fullWidth margin="normal">
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value}
        onChange={onChange}
        aria-describedby={helperText ? `${label}-helper` : undefined}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default AppSelect;
