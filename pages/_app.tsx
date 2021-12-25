import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/provider";
import theme from "../utils/theme";
import "@fontsource/lexend/latin.css";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
