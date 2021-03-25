import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { NewMessage } from "../config/types";
import { Message } from "../entities/Message";

export const chatSocket = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap>
) => {
  console.log("Connected");

  socket.on("startChat", (roomId: number) => {
    console.log("joining room", roomId);
    socket.join(roomId.toString());
  });
  socket.on(
    "message",
    async ({ matchId, senderId, recipientId, text }: NewMessage) => {
      const newMessage = Message.create({
        matchId,
        senderId,
        recipientId,
        text,
      });
      // const newMessage = await Message.create({
      //   matchId,
      //   senderId,
      //   recipientId,
      //   text,
      // }).save();
      console.log(newMessage);
      socket.broadcast.to(matchId.toString()).emit("new-message", newMessage);
    }
  );

  socket.on("disconnecting", (reason) => {
    console.log(reason, "Disconnected");
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.to(room).emit("user has left", socket.id);
      }
    }
  });
};
