import React from "react";
import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import theme from "../theme";

import { Provider, createClient } from "urql";

const client = createClient({
  url: "http://127.0.0.1:5000/graphql",
  fetchOptions: {
    credentials: "include",
  },
});

const MyApp = ({ Component, pageProps }: any) => {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </Provider>
  );
};

export default MyApp;
