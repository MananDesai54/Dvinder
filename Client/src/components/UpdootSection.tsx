import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import {
  RegularFeedFragment,
  useVoteMutation,
  VoteMutation,
} from "../generated/apollo-graphql";
import gql from "graphql-tag";
import { ApolloCache } from "@apollo/client";
// import { RegularFeedFragment, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
  feed: RegularFeedFragment;
}

const updateVotes = (
  value: number,
  feedId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: "Feed:" + feedId,
    fragment: gql`
      fragment _ on Feed {
        id
        points
        voteStatus
      }
    `,
  });
  if (data) {
    if (((data as any).voteStatus as number) === value) {
      return;
    }
    const updatePoints = ((data as any).voteStatus as number)
      ? 2 * value
      : value;
    const newPoints = ((data as any).points as number) + updatePoints;
    cache.writeFragment({
      id: "Feed:" + feedId,
      fragment: gql`
        fragment __ on Feed {
          points
          voteStatus
        }
      `,
      data: { points: newPoints, voteStatus: value },
    });
  }
};

const UpdootSection: FC<UpdootSectionProps> = ({ feed }) => {
  // const [, vote] = useVoteMutation();
  const [vote] = useVoteMutation();

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
          // vote({ value: 1, feedId: feed.id });
          vote({
            variables: { value: 1, feedId: feed.id },
            update: (cache) => updateVotes(1, feed.id, cache),
          });
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
          // vote({ value: -1, feedId: feed.id });
          vote({
            variables: { value: -1, feedId: feed.id },
            update: (cache) => updateVotes(-1, feed.id, cache),
          });
        }}
      />
    </Flex>
  );
};

export default UpdootSection;
