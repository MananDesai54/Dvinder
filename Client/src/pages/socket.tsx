import { Button } from "@chakra-ui/button";
import { FC, useEffect } from "react";
import { socket } from "../utils/socket";

interface SocketProps {}
const Socket: FC<SocketProps> = ({}) => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id);
    });
  }, []);
  return (
    <>
      <p
        style={{
          color: "white",
        }}
      >
        Hello
      </p>
    </>
  );
};

export default Socket;
