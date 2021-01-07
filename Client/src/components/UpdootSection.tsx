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
        aria-label="down"
        variant="outline"
        colorScheme="blue"
        fontSize="25px"
        size="8"
        icon={<ChevronUpIcon />}
        onClick={() => {
          vote({ value: 1, feedId: feed.id });
        }}
      />

      <Text>{feed.points}</Text>
      <IconButton
        aria-label="down"
        variant="outline"
        colorScheme="blue"
        fontSize="25px"
        size="8"
        icon={<ChevronDownIcon />}
        onClick={() => {
          vote({ value: 1, feedId: feed.id });
        }}
      />
    </Flex>
  );
};

export default UpdootSection;
