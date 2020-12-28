import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { FC } from "react";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { isServer } from "../utils";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  let body = null;

  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  // data is loading
  if (fetching) {
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
          onClick={() => {
            console.log("Logout");
            logout();
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
      <Box ml="auto">{body}</Box>
    </Flex>
  );
};

export default Navbar;
