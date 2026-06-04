import type { AppProps } from "next/app";
import "../styles/theme.css";
import "../styles/layout.css";
import "../styles/components.css";
import "../styles/utilities.css";
import "../styles/landing.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
