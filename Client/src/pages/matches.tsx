import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Input } from "@chakra-ui/input";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { FaLaugh } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import {
  Message,
  useMatchesQuery,
  useMeQuery,
  useMessagesMutation,
} from "../generated/apollo-graphql";
import { withApolloClient } from "../utils/withApollo";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { isServer } from "../utils";
import { socket } from "../utils/socket";
import { Maybe } from "graphql/jsutils/Maybe";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

interface MatchesProps {}

const Matches: FC<MatchesProps> = ({}) => {
  const router = useRouter();
  const { data } = useMatchesQuery();
  const { data: user, loading } = useMeQuery();
  const [selectedMatch, setSelectedMatch] = useState(0);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");
  const [getMessages, { loading: fetchingMessages }] = useMessagesMutation();

  const [messages, setMessages] = useState<
    Maybe<
      Array<
        { __typename?: "Message" } & Pick<
          Message,
          "text" | "matchId" | "senderId" | "recipientId" | "createdAt"
        >
      >
    >
  >([]);

  useEffect(() => {
    if (!user?.me && !loading && !isServer()) {
      router.replace("/auth/login");
    } else {
      getMessages({ variables: { matchId: +(router.query.mid as any) } }).then(
        (data) => {
          setMessages(data.data?.messages);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (data && data.matches) {
      socket.on("connect", () => {
        socket.emit("startChat", data.matches![selectedMatch].match.id);
      });
      socket.on("new-message", (message) => {
        console.log(message);
        setMessages((prev) => [...(prev || []), message]);
      });
    }
  }, [data]);

  useEffect(() => {
    socket.emit(
      "startChat",
      router.query.id || data!.matches![selectedMatch].match.id
    );
    getMessages({ variables: { matchId: +(router.query.mid as any) } }).then(
      (data) => {
        setMessages(data.data?.messages);
      }
    );
  }, [router.query]);

  const sendMessage = () => {
    const newMessage = {
      matchId: data!.matches![selectedMatch].match.id,
      senderId: user!.me!.id,
      recipientId: data!.matches![selectedMatch].user.id,
      text: message,
    };
    socket.emit("message", newMessage);
    setMessages((prev) => [
      ...(prev || []),
      { ...newMessage, createdAt: Date.now() } as any,
    ]);
    setMessage("");
  };

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
                  onClick={() => {
                    router.push(`/matches?mid=${match.match.id}`);
                    setSelectedMatch(index);
                  }}
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
        <Flex flexDirection="column" flex="1">
          {messages &&
            messages.map((message, index) => (
              <Box
                bg={
                  message.senderId === user!.me!.id
                    ? "var(--background-secondary)"
                    : "var(--background-tertiary)"
                }
                color={
                  message.senderId === user!.me!.id
                    ? "var(--text-primary)"
                    : "var(--background-extra2)"
                }
                maxWidth="60%"
                alignSelf={
                  message.senderId === user!.me!.id ? "flex-end" : "flex-start"
                }
                key={index}
                p={2}
                borderRadius={
                  message.senderId === user!.me!.id
                    ? "5px 0 5px 5px"
                    : "0 5px 5px 5px"
                }
                my={1}
                mx={4}
              >
                <Text>{message.text}</Text>
                <Text w="100%" fontSize="0.7rem" textAlign="right">
                  {dayjs(message.createdAt).format("h:mm A")}
                </Text>
              </Box>
            ))}
        </Flex>
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
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            onKeyUp={(e) => {
              if (e.code === "NumpadEnter" || e.code === "Enter") {
                sendMessage();
              }
            }}
          />
          <MdSend
            size={30}
            style={{
              cursor: message.length === 0 ? "not-allowed" : "pointer",
              color:
                message.length === 0 ? "rgba(255, 255, 255, 0.2)" : "white",
            }}
            onClick={message.length !== 0 ? () => sendMessage() : () => {}}
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
