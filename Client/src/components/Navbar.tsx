import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { FC } from "react";
import NextLink from "next/link";
// import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import {
  useMeQuery,
  useLogoutMutation,
  MeQuery,
  MeDocument,
} from "../generated/apollo-graphql";
import { isServer } from "../utils";
import { useApolloClient } from "@apollo/client";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = ({}) => {
  // const [{ data, fetching }] = useMeQuery({
  //   pause: isServer(),
  // });
  const { data, loading } = useMeQuery({
    // pause: isServer(),
    skip: isServer(),
  });
  const apolloClient = useApolloClient();
  let body = null;

  // const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [logout, { loading: logoutFetching }] = useLogoutMutation();

  // data is loading
  // if (fetching) {
  if (loading) {
    //user not loggedIn
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/auth/login">
          <Link mx={4}> Login </Link>
        </NextLink>
        <NextLink href="/auth/register">
          <Link mx={4}> Register </Link>
        </NextLink>
      </>
    );
    //user loggedIn
  } else {
    body = (
      <Flex>
        <Box mx={4}>{data.me.username}</Box>
        <Button
          isLoading={logoutFetching}
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
    );
  }

  return (
    <Flex bg="tan" p={4}>
      <NextLink href="/create-feed">
        <Link mx={4}> Create Feed </Link>
      </NextLink>
      <Box ml="auto">{body}</Box>
    </Flex>
  );
};

export default Navbar;
