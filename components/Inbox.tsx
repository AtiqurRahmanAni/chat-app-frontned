import {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useContext,
  useState,
  useLayoutEffect,
} from "react";
import ChatCard from "./ChatCard";
import Form from "./Form";
import useWebSocket from "react-use-websocket";
import { fetchMessageFromThread } from "@/actions/fetch-messages-from-thread";
import toast from "react-hot-toast";
import { AuthContext } from "@/contexts/AuthContext";

type Message = {
  text: string;
  isMine: boolean;
};

type ReceivedMessage = {
  message: string;
  message_type: string;
  message_owner: number;
};

enum MessageType {
  Text = "text",
  Image = "image",
  Voice = "voice",
}

enum ReadyState {
  UNINSTANTIATED = -1,
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

const Inbox: React.FC<{
  threadId: number;
}> = ({ threadId }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { userInfo } = useContext(AuthContext);
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetchMessageFromThread(threadId);

      if ("error" in response) {
        toast.error(response.error);
      } else {
        const temp = response.map((item) => ({
          text: item.content,
          isMine: item.user === userInfo?.id,
        }));
        setMessages(temp);
      }
    };
    fetchMessages();
  }, [threadId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  const socketUrl = `${process.env.NEXT_PUBLIC_CHAT_URL}/${threadId}/`;

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(socketUrl, {
    onOpen: () => console.log("socket opened"),
    shouldReconnect: (closeEvent) => true,
    onClose: () => console.log("socket closed"),
    onMessage: (messageEvent) => {
      const data: ReceivedMessage = JSON.parse(messageEvent.data);
      setMessages((prev) => [
        ...prev,
        { text: data.message, isMine: data.message_owner === userInfo?.id },
      ]);
    },
  });

  const handleSubmit = (value: string): void => {
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage(
        {
          message: value,
          message_type: MessageType.Text,
          from: userInfo?.id,
        },
        false
      );
    }
  };

  return (
    <div className="flex flex-col justify-center items-center max-h-screen p-2 w-full">
      <div className="flex flex-col w-full overflow-y-scroll mb-2 h-screen px-2 mt-20">
        {messages.map((obj, index) => (
          <ChatCard key={index} isMine={obj.isMine} message={obj.text} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <Form handleSubmit={handleSubmit} />
    </div>
  );
};

export default Inbox;
