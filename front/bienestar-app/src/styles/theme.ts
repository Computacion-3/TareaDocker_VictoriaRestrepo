import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#60a5fa",
      light: "#93c5fd",
      dark: "#2563eb",
    },
    secondary: {
      main: "#8b5cf6",
      light: "#c4b5fd",
      dark: "#6d28d9",
    },
    background: {
      default: "#05070d",
      paper: "rgba(15, 23, 42, 0.72)",
    },
    text: {
      primary: "rgba(255, 255, 255, 0.92)",
      secondary: "rgba(226, 232, 240, 0.68)",
    },
  },
  typography: {
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h1: { fontWeight: 800, letterSpacing: 0 },
    h2: { fontWeight: 800, letterSpacing: 0 },
    h3: { fontWeight: 750, letterSpacing: 0 },
    h4: { fontWeight: 750, letterSpacing: 0 },
    h5: { fontWeight: 700, letterSpacing: 0 },
    h6: { fontWeight: 700, letterSpacing: 0 },
    button: { fontWeight: 700, letterSpacing: 0, textTransform: "none" },
  },
  shape: {
    borderRadius: 18,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 44,
          borderRadius: 18,
          boxShadow: "none",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          backgroundColor: "rgba(255, 255, 255, 0.055)",
          backdropFilter: "blur(10px)",
          color: "rgba(255, 255, 255, 0.92)",
        },
        notchedOutline: {
          borderColor: "rgba(255, 255, 255, 0.12)",
        },
        input: {
          "&::placeholder": {
            color: "rgba(255, 255, 255, 0.35)",
            opacity: 1,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(255, 255, 255, 0.12)",
          background: "rgba(15, 23, 42, 0.72)",
          backdropFilter: "blur(20px) saturate(160%)",
          boxShadow: "0 24px 80px rgba(0, 0, 0, 0.36)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          border: "1px solid rgba(255, 255, 255, 0.12)",
          background: "rgba(15, 23, 42, 0.9)",
          backdropFilter: "blur(24px)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: "rgba(255, 255, 255, 0.08)",
        },
      },
    },
  },
});

export default theme;
