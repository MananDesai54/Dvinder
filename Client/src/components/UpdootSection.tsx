import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import { RegularFeedFragment, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
  feed: RegularFeedFragment;
}

const UpdootSection: FC<UpdootSectionProps> = ({ feed }) => {
  const [, vote] = useVoteMutation();

  return (
    <Flex mr={4} justifyContent="center" alignItems="center" direction="column">
      <IconButton
        // disabled={feed.voteStatus === 1}
        pointerEvents={feed.voteStatus === 1 ? "none" : "fill"}
        aria-label="down"
        // variant={feed.voteStatus === 1 ? "solid" : "outline"}
        colorScheme={feed.voteStatus === 1 ? "green" : undefined}
        fontSize="25px"
        size="8"
        icon={<ChevronUpIcon />}
        onClick={() => {
          if (feed.voteStatus === 1) {
            return;
          }
          vote({ value: 1, feedId: feed.id });
        }}
      />

      <Text>{feed.points}</Text>
      <IconButton
        // disabled={feed.voteStatus === -1}
        pointerEvents={feed.voteStatus === -1 ? "none" : "fill"}
        aria-label="down"
        // variant={feed.voteStatus === -1 ? "solid" : "outline"}
        colorScheme={feed.voteStatus === -1 ? "red" : undefined}
        fontSize="25px"
        size="8"
        icon={<ChevronDownIcon />}
        onClick={() => {
          if (feed.voteStatus === -1) {
            return;
          }
          vote({ value: -1, feedId: feed.id });
        }}
      />
    </Flex>
  );
};

export default UpdootSection;
