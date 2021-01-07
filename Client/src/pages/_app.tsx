import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
// import { Provider } from "urql";
import theme from "../theme";
// import { createClientUrql } from "../utils/createClientUrql";

// const client = createClientUrql();

const MyApp = ({ Component, pageProps }: any) => {
  return (
    // <Provider value={client}>
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
        }}
      >
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
    // </Provider>
  );
};

export default MyApp;
