import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import theme from "../theme";
import "../css/style.css";
import BackgroundCanvas from "../components/BackgroundCanvas";

const MyApp = ({ Component, pageProps }: any) => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
        }}
      >
        <BackgroundCanvas />
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
  );
};

export default MyApp;
