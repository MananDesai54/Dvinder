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

interface NavbarProps {}

const Navbar: FC<NavbarProps> = ({}) => {
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });

  const [logout, { loading: logoutFetching }] = useLogoutMutation();

  return <p></p>;
};

export default Navbar;
