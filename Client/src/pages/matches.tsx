import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Input } from "@chakra-ui/input";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { FaLaugh } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import { useMatchesQuery, useMeQuery } from "../generated/apollo-graphql";
import { withApolloClient } from "../utils/withApollo";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { isServer } from "../utils";
import { socket } from "../utils/socket";

interface MatchesProps {}

const Matches: FC<MatchesProps> = ({}) => {
  const router = useRouter();
  const { data } = useMatchesQuery();
  const { data: user, loading } = useMeQuery();
  const [selectedMatch, setSelectedMatch] = useState(0);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user?.me && !loading && !isServer()) {
      router.replace("/auth/login");
    }
  }, []);

  useEffect(() => {
    console.log(data);
    if (data && data.matches) {
      socket.on("connect", () => {
        socket.emit("startChat", data.matches![selectedMatch].match.id);
      });
      socket.on("new-message", (message) => {
        console.log(message);
      });
    }
  }, [data]);

  useEffect(() => {
    socket.emit("startChat", data!.matches![selectedMatch].match.id);
  }, [selectedMatch]);

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
            (match, index) =>
              match.user && (
                <Flex
                  cursor="pointer"
                  onClick={() => setSelectedMatch(index)}
                  color="white"
                  key={match.user.id}
                  style={{
                    padding: "0.5rem",
                    background:
                      selectedMatch === index
                        ? "rgb(76, 99, 201)"
                        : "transparent",
                    transition: "all 400ms ease",
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
          alignItems="center"
        >
          {!isServer() && openEmojiPicker && (
            <Picker
              set="apple"
              theme="dark"
              onSelect={(value: any) =>
                setMessage((prev) => prev + value.native)
              }
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          )}
          <FaLaugh
            size={30}
            onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
            style={{
              cursor: "pointer",
            }}
          />
          <Input
            mx={2}
            value={message}
            placeholder="Your message.."
            onChange={(e) => setMessage(e.target.value)}
          />
          <MdSend
            size={30}
            style={{
              cursor: message.length === 0 ? "not-allowed" : "pointer",
              color:
                message.length === 0 ? "rgba(255, 255, 255, 0.2)" : "white",
            }}
            onClick={
              message.length !== 0
                ? () => {
                    socket.emit("message", {
                      matchId: data!.matches![selectedMatch].match.id,
                      senderId: user?.me?.id,
                      recipientId: data!.matches![selectedMatch].user.id,
                      text: message,
                    });
                  }
                : () => {}
            }
          />
        </Flex>
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
