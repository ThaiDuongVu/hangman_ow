import type { AppProps } from "next/app";
import "@/styles/global.css";
// import  "bootstrap/dist/css/bootstrap.css";
import "@/styles/bootstrap-sketchy.css";
import { useEffect } from "react";

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("bootstrap/dist/js/bootstrap.bundle.js");
  }, []);
  return <Component {...pageProps} />;
}

export default App;
