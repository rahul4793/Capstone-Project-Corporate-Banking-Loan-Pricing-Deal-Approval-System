import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0B3C5D", // banking navy
    },
    secondary: {
      main: "#328CC1",
    },
    background: {
      default: "#F4F6F8",
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, Arial",
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 500 },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;
