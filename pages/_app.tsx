import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/provider";
import theme from "../utils/theme";
import "@fontsource/lexend/latin.css";
import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer } from "react-toastify";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <ToastContainer />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
