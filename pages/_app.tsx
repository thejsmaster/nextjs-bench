import type { AppProps } from "next/app";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import "../styles/theme.css";
import "../styles/layout.css";
import "../styles/components.css";
import "../styles/utilities.css";
import "../styles/landing.css";

const theme = createTheme({
  palette: { primary: { main: "#4a6cf7" } },
  typography: { fontFamily: "system-ui, sans-serif" },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
