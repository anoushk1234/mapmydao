import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../utils/theme";
import "@fontsource/lexend/latin.css";
import "react-datetime/css/react-datetime.css";
import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // <SafeHydrate>
    <ChakraProvider theme={theme}>
      <ToastContainer />
      <Component {...pageProps} />
    </ChakraProvider>
    // </SafeHydrate>
  );
}

export default MyApp;
