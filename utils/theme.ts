import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

// 2. Add your color mode config
const theme = extendTheme({
  fonts: {
    body: "Lexend, sans-serif",
    heading: "Lexend, serif",
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  styles: {
    global: (props: any) => ({
      body: {
        color: mode("#1A1B1C", "white")(props),
        bg: mode("#1A1B1C", "#1A1B1C")(props),
        //bg: mode("gray.50", "rgba(56, 14, 37, 1)")(props),
        //bgGradient:mode("gray.100","linear(to-br,rgba(255, 255, 255, 0.4),rgba(255, 255, 255, 0.1),rgba(47, 104, 249, 1),rgba(144, 39, 234, 1))")(props),
      },
    }),
  },
});
export default theme;
