import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import theme from "../theme";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { FeedPagination } from "../generated/apollo-graphql";

const MyApp = ({ Component, pageProps }: any) => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
        }}
      >
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
  );
};

export default MyApp;
