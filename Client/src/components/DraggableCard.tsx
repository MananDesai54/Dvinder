import { IconButton } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { FC, Fragment, useState } from "react";
import Draggable from "react-draggable";
import { FaHeart, FaTimes } from "react-icons/fa";
import {
  DvinderProfile,
  FeedDataForProfile,
} from "../generated/apollo-graphql";
import { getAge } from "../utils/getUserAge";
import ProfileFeeds from "./ProfileFeeds";

interface DraggableCardProps {
  userProfiles: Array<
    { __typename?: "DvinderProfile" } & Pick<
      DvinderProfile,
      | "username"
      | "profileUrl"
      | "bio"
      | "githubUsername"
      | "birthDate"
      | "flair"
      | "distance"
    > & {
        feeds: Array<
          { __typename?: "FeedDataForProfile" } & Pick<
            FeedDataForProfile,
            "title" | "imageUrl" | "code" | "projectIdea" | "theme" | "language"
          >
        >;
      }
  >;
}

const DraggableCard: FC<DraggableCardProps> = ({ userProfiles }) => {
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [profiles, setProfiles] = useState(userProfiles || []);
  const [position, setPosition] = useState<{ x: number; y: number }[]>(
    Array(profiles.length).fill({ x: 0, y: 0 })
  );
  const [isLiked, setIsLiked] = useState<boolean[]>(
    Array(profiles.length).fill(false)
  );
  const [isTouched, setIsTouched] = useState<boolean[]>(
    Array(profiles.length).fill(false)
  );
  return (
    <Fragment>
      {profiles &&
        profiles.map(
          (profile, index) =>
            profile && (
              <Draggable
                key={index}
                position={position[index]}
                onStop={(e: any) => {
                  const diffX = e.clientX - dragStart.x;
                  const diffY = e.clientY - dragStart.y;
                  if (diffX < -100) {
                    setPosition((prev) =>
                      prev.map((item, _index) => {
                        if (_index === index) {
                          return {
                            x: item.x + diffX,
                            y: item.y + diffY,
                          };
                        }
                        return item;
                      })
                    );
                    console.log("Nope");
                    setProfiles(
                      profiles.filter((_, _index) => index !== _index)
                    );
                  } else if (diffX > 100) {
                    setPosition((prev) =>
                      prev.map((item, _index) => {
                        if (_index === index) {
                          return {
                            x: item.x + diffX,
                            y: item.y + diffY,
                          };
                        }
                        return item;
                      })
                    );
                    console.log("Like");
                    setProfiles(
                      profiles.filter((_, _index) => index !== _index)
                    );
                  } else {
                    console.log("Don't react");
                  }
                  setIsTouched((prev) => prev.map((_) => false));
                }}
                onStart={(e: any) => {
                  setDragStart({ x: e.clientX, y: e.clientY });
                }}
                onDrag={(e: any) => {
                  const diffX = e.clientX - dragStart.x;
                  if (diffX < -100) {
                    if (isLiked[index] || !isTouched[index]) {
                      setIsTouched((prev) =>
                        prev.map((item, _index) => {
                          if (index === _index) {
                            return true;
                          }
                          return item;
                        })
                      );
                      setIsLiked((prev) =>
                        prev.map((item, _index) => {
                          if (index === _index) {
                            return false;
                          }
                          return item;
                        })
                      );
                    }
                  } else if (diffX > 100) {
                    if (!isLiked[index]) {
                      setIsTouched((prev) =>
                        prev.map((item, _index) => {
                          if (index === _index) {
                            return true;
                          }
                          return item;
                        })
                      );
                      setIsLiked((prev) =>
                        prev.map((item, _index) => {
                          if (index === _index) {
                            return true;
                          }
                          return item;
                        })
                      );
                    }
                  } else {
                    if (isTouched[index]) {
                      setIsTouched((prev) => prev.map((_) => false));
                    }
                  }
                }}
              >
                <Flex
                  color="white"
                  bg="var(--background-extra)"
                  position="absolute"
                  borderRadius="5px"
                  style={{
                    width: "95%",
                    maxWidth: "400px",
                    height: "75vh",
                    maxHeight: "600px",
                  }}
                  flexDirection="column"
                  cursor="grab"
                >
                  <Box
                    flex="1"
                    borderTopLeftRadius="5px"
                    borderTopRightRadius="5px"
                    overflow="hidden"
                  >
                    <ProfileFeeds
                      feeds={profile.feeds}
                      profileUrl={profile.profileUrl}
                      isLiked={isLiked[index]}
                      isTouched={isTouched[index]}
                    />
                  </Box>
                  <Flex
                    bg="#000"
                    borderBottomLeftRadius="5px"
                    borderBottomRightRadius="5px"
                    p="1rem"
                  >
                    <Image
                      src={profile.profileUrl}
                      alt={profile.username}
                      h="50px"
                      w="50px"
                      borderRadius="50px"
                    />
                    <Box
                      flex={1}
                      noOfLines={1}
                      color="var(--text-primary)"
                      ml="0.5rem"
                    >
                      <Flex alignItems="center">
                        <Text fontSize="1.2rem" fontWeight="bold">
                          {profile.username}
                        </Text>
                        {","}
                        <Text mx="0.3rem">{getAge(profile.birthDate)}</Text>
                        <Image
                          src={`https://img.icons8.com/color/24/000000/${profile.flair}`}
                          alt={profile.flair || "Image"}
                        />
                      </Flex>
                      <Text fontSize="0.9rem">{profile.bio}</Text>
                    </Box>
                  </Flex>
                </Flex>
              </Draggable>
            )
        )}
      ;
      <Flex
        position="absolute"
        bottom="1rem"
        w="200px"
        justifyContent="space-between"
      >
        <IconButton
          style={{
            background: "var(--color-danger)",
          }}
          aria-label="nope"
          icon={<FaTimes />}
          fontSize="1.5rem"
          borderRadius="100vw"
        />
        <IconButton
          style={{
            background: "var(--color-success)",
          }}
          aria-label="like"
          icon={<FaHeart />}
          fontSize="1.5rem"
          borderRadius="100vw"
        />
      </Flex>
    </Fragment>
  );
};

export default DraggableCard;
