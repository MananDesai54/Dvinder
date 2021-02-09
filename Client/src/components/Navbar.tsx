import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { FC, Fragment } from "react";
import NextLink from "next/link";
import {
  useMeQuery,
  useLogoutMutation,
  MeQuery,
  MeDocument,
} from "../generated/apollo-graphql";
import { isServer } from "../utils";
import { useApolloClient } from "@apollo/client";
// import { useMeQuery, useLogoutMutation } from "../generated/graphql";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = ({}) => {
  // const [{ data, fetching }] = useMeQuery({
  //   pause: isServer(),
  // });
  const { data, loading } = useMeQuery({
    // pause: isServer(),
    skip: isServer(),
  });

  // const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [logout, { loading: logoutFetching }] = useLogoutMutation();

  return (
    <Flex
      style={{
        background: "transparent",
      }}
      p={4}
    >
      {!isServer() && (
        <Fragment>
          <NextLink href="/create-feed">
            <Link mx={4}> Create Feed </Link>
          </NextLink>
          <Box ml="auto">
            <Flex>
              <Box mx={4}>{data?.me?.username}</Box>
              <Button
                isLoading={logoutFetching}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "0.8rem",
                  background: "var(--background-primary)",
                }}
                onClick={async () => {
                  console.log("Logout");
                  await logout({
                    update: (cache, { data }) => {
                      cache.writeQuery<MeQuery>({
                        query: MeDocument,
                        data: {
                          __typename: "Query",
                          me: null,
                        },
                      });
                      // cache.evict({ fieldName: "feeds" });
                    },
                  });
                  // apolloClient.resetStore();
                }}
                variant="link"
              >
                Logout
              </Button>
            </Flex>
          </Box>
        </Fragment>
      )}
    </Flex>
  );
};

export default Navbar;
