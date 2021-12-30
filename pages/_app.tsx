import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/provider";
import theme from "../utils/theme";
import "@fontsource/lexend/latin.css";
import "react-datetime/css/react-datetime.css";
import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer } from "react-toastify";
// function SafeHydrate({ children }: any) {
//   return (
//     <div suppressHydrationWarning>
//       {typeof window === "undefined" ? null : children}
//     </div>
//   );
// }
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
