import { Box } from "@chakra-ui/layout";
import { FC } from "react";
import { Maybe, RegularUserFragment } from "../generated/apollo-graphql";

interface MatchesProps {
  matches: Maybe<Array<{ __typename?: "User" } & RegularUserFragment>>;
}

const Matches: FC<MatchesProps> = ({ matches }) => {
  return (
    <Box>
      {matches && matches.length > 0 ? (
        matches.map((match) => <p key={match.id}>{match.username}</p>)
      ) : (
        <p>No Matches found</p>
      )}
    </Box>
  );
};

export default Matches;
