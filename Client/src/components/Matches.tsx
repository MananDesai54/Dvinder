import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { useRouter } from "next/router";
import { FC } from "react";
import { Maybe, RegularUserFragment, Match } from "../generated/apollo-graphql";

interface MatchesProps {
  matches: Maybe<
    Array<
      {
        __typename?: "MatchesResult";
      } & {
        user: {
          __typename?: "User";
        } & RegularUserFragment;
        match: {
          __typename?: "Match";
        } & Pick<
          Match,
          | "id"
          | "userId1"
          | "userId2"
          | "read1"
          | "read2"
          | "unmatched"
          | "createdAt"
        >;
      }
    >
  >;
}

const Matches: FC<MatchesProps> = ({ matches }) => {
  const router = useRouter();
  console.log(matches);
  return (
    <Box cursor="pointer">
      {matches && matches.length > 0 ? (
        matches.map(
          (match) =>
            match.user && (
              <Flex
                key={match.user.id}
                style={{
                  padding: "0.5rem",
                  background: "var(--text-primary)",
                  borderRadius: "10px",
                }}
                onClick={() => router.push(`/matches?mid=${match.match.id}`)}
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
        )
      ) : (
        <p>No Matches found</p>
      )}
    </Box>
  );
};

export default Matches;
