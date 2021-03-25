import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { useMatchesQuery } from "../generated/apollo-graphql";
import { withApolloClient } from "../utils/withApollo";

interface MatchesProps {}

const Matches: FC<MatchesProps> = ({}) => {
  const router = useRouter();
  const { data } = useMatchesQuery();
  const [selectedMatch, setSelectedMatch] = useState(0);
  return data?.matches ? (
    <Flex>
      <Box
        w="30%"
        bg="rgb(76, 99, 201, 0.2)"
        h="100vh"
        borderRight="1px solid rgba(255, 255, 255, 0.2)"
      >
        <Text
          h="60px"
          fontSize="1.2rem"
          fontWeight="bold"
          textAlign="center"
          lineHeight="60px"
          color="white"
        >
          Matches
        </Text>
        {data &&
          data.matches?.map(
            (match) =>
              match.user && (
                <Flex
                  color="white"
                  key={match.user.id}
                  style={{
                    padding: "0.5rem",
                    background:
                      match.match.id.toString() === router.query.mid
                        ? "rgb(76, 99, 201)"
                        : "transparent",
                  }}
                >
                  <Avatar
                    src={match.user.profileUrl}
                    name={match.user.username}
                    mr={4}
                  />
                  <Box>
                    <Flex alignItems="center">
                      <Text>{match.user.username.toUpperCase()}</Text>
                      <Image
                        src={`https://img.icons8.com/color/24/000000/${match.user.flair}`}
                        alt={match.user.username}
                        w="20px"
                        h="20px"
                        ml="0.5rem"
                      />
                    </Flex>
                    <Text noOfLines={1}>{match.user.bio}</Text>
                  </Box>
                </Flex>
              )
          )}
      </Box>
      <Flex flexDirection="column" flex="1">
        <Flex
          h="60px"
          color="white"
          style={{
            background: "rgb(76, 99, 201, 0.2)",
          }}
          p="0.5rem"
        >
          <Avatar
            src={data?.matches[selectedMatch].user.profileUrl}
            name={data?.matches[selectedMatch].user.username}
            mr={4}
          />
          <Box>
            <Flex alignItems="center">
              <Text>
                {data?.matches[selectedMatch].user.username.toUpperCase()}
              </Text>
              <Image
                src={`https://img.icons8.com/color/24/000000/${data?.matches[selectedMatch].user.flair}`}
                alt={data?.matches[selectedMatch].user.username}
                w="20px"
                h="20px"
                ml="0.5rem"
              />
            </Flex>
            <Text noOfLines={1}>{data?.matches[selectedMatch].user.bio}</Text>
          </Box>
        </Flex>
        <Box flex="1"></Box>
        <Flex
          h="60px"
          color="white"
          style={{
            background: "rgb(76, 99, 201, 0.2)",
          }}
          p="0.5rem"
        ></Flex>
      </Flex>
    </Flex>
  ) : (
    <p
      style={{
        color: "white",
      }}
    >
      No Matches
    </p>
  );
};

export default withApolloClient({ ssr: true })(Matches);
