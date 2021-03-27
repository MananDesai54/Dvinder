import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Arg, Int, Mutation, Resolver } from "type-graphql";
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
      const newMessage = await Message.create({
        matchId,
        senderId,
        recipientId,
        text,
      }).save();
      console.log(newMessage);
      socket.broadcast
        .to(matchId.toString())
        .emit("new-message", { ...newMessage, createdAt: Date.now() });
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

@Resolver(Message)
export class ChatResolver {
  @Mutation(() => [Message], { nullable: true })
  async messages(
    @Arg("matchId", () => Int) matchId: number
  ): Promise<Message[] | null> {
    try {
      const messages = await Message.find({ where: { matchId } });
      return messages;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }
}
