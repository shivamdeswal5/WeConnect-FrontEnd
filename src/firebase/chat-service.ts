import { db } from "./firebase";
import { ref, push, set, onValue, off } from "firebase/database";
import { generateChatRoomId } from "@/utils/generateChatRoomId";

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
}

export async function sendMessage(
  senderId: string,
  receiverId: string,
  text: string
) {
  const chatRoomId = generateChatRoomId(senderId, receiverId);
  const messageRef = push(ref(db, `chatRooms/${chatRoomId}/messages`));

  const message: ChatMessage = {
    id: messageRef.key!,
    senderId,
    receiverId,
    text,
    timestamp: Date.now(),
  };

  await set(messageRef, message);
}

export function listenToMessages(
  userId1: string,
  userId2: string,
  callback: (messages: ChatMessage[]) => void
) {
  const chatRoomId = generateChatRoomId(userId1, userId2);
  const messagesRef = ref(db, `chatRooms/${chatRoomId}/messages`);

  const unsubscribe = onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    const messages: ChatMessage[] = data
      ? (Object.values(data) as ChatMessage[]).sort(
          (a: ChatMessage, b: ChatMessage) => a.timestamp - b.timestamp
        )
      : [];
    callback(messages);
  });

  return () => off(messagesRef, "value");
}
