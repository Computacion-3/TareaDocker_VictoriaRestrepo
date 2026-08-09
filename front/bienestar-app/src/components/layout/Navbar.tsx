import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import logoIcesi from "../../assets/images/logoIcesi.png";

const navigation = [
  { label: "Inicio", path: "/" },
  { label: "Rutinas", path: "/routines" },
  { label: "Ejercicios", path: "/exercises" },
  { label: "Eventos", path: "/events" },
  { label: "Progreso", path: "/progress" },
];

function Navbar() {
  return (
    <AppBar
      color="transparent"
      elevation={0}
      position="sticky"
      sx={{
        backdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        top: 0,
        zIndex: "var(--z-nav)",
      }}
    >
      <Toolbar sx={{ gap: 2, minHeight: 72 }}>
        <Box
          component="img"
          src={logoIcesi}
          alt="Universidad Icesi"
          sx={{
            height: 36,
            objectFit: "contain",
            width: 36,
          }}
        />
        <Typography sx={{ flexGrow: 1 }} variant="h6">
          Fitness Icesi
        </Typography>
        <Box
          component="nav"
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 1,
          }}
        >
          {navigation.map((item) => (
            <Box
              key={item.path}
              component={RouterLink}
              to={item.path}
              sx={{
                borderRadius: 999,
                color: "text.secondary",
                px: 1.5,
                py: 0.75,
                transition: "background 160ms ease, color 160ms ease",
                "&:hover": {
                  background: "rgba(255,255,255,0.08)",
                  color: "text.primary",
                },
              }}
            >
              {item.label}
            </Box>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
