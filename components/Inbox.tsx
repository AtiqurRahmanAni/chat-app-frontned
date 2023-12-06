import {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useContext,
  useState,
} from "react";
import ChatCard from "./ChatCard";
import Form from "./Form";
import useWebSocket from "react-use-websocket";
import { fetchMessageFromThread } from "@/actions/fetch-messages-from-thread";
import toast from "react-hot-toast";
import { AuthContext } from "@/contexts/AuthContext";
import { MessageType } from "@/types";
import { useRouter } from "next/navigation";
import {
  sendTextMessageServer,
  sendFileMessageServer,
} from "@/actions/send-message-action";
import { Response } from "@/actions/send-message-action";

type Message = {
  content: string;
  contentType: string;
  upload: string;
  isMine: boolean;
};

type ReceivedMessage = {
  message: string;
  message_type: string;
  message_owner: number;
  upload: string;
};

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
  const router = useRouter();

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetchMessageFromThread(threadId);

      if ("error" in response) {
        toast.error(response.error);
      } else {
        const temp = response.map((item) => ({
          content: item.content,
          contentType: item.content_type,
          upload: item.upload,
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
    // sendMessage,
    // sendJsonMessage,
    // lastMessage,
    // lastJsonMessage,
    readyState,
    // getWebSocket,
  } = useWebSocket(socketUrl, {
    onOpen: () => console.log("socket opened"),
    shouldReconnect: (closeEvent) => true,
    onClose: () => console.log("socket closed"),
    onMessage: (messageEvent) => {
      const data: ReceivedMessage = JSON.parse(messageEvent.data);
      setMessages((prev) => [
        ...prev,
        {
          content: data.message,
          contentType: data.message_type,
          isMine: data.message_owner === userInfo?.id,
          upload: data.upload,
        },
      ]);
    },
  });

  const handleResponseError = (response: Response) => {
    if (response && response.status === 401) {
      toast.error("Session expired");
      router.replace("/login");
    } else if (response && response.status === 500) {
      toast.error(response.error);
    }
  };

  const handleSubmit = async (
    value: string | File,
    message_type: MessageType
  ): Promise<void> => {
    if (readyState === ReadyState.OPEN) {
      if (message_type === MessageType.Text) {
        const response = await sendTextMessageServer(
          userInfo?.id as number,
          threadId,
          value as string,
          message_type
        );

        handleResponseError(response);
      } else if (message_type === MessageType.Image) {
        const formData = new FormData();
        formData.append("user_id", String(userInfo?.id));
        formData.append("thread_id", String(threadId));
        formData.append("message_files", value);
        formData.append("message_type", message_type);
        const response = await sendFileMessageServer(formData);

        handleResponseError(response);
      }
    } else {
      toast.error("Disconnected");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center max-h-screen p-2 w-full">
      <div className="flex flex-col w-full overflow-y-scroll mb-2 h-screen px-2 mt-20">
        {messages.map((obj, index) => (
          <ChatCard
            key={index}
            isMine={obj.isMine}
            content={obj.content}
            contentType={obj.contentType}
            upload={obj.upload}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <Form handleSubmit={handleSubmit} />
    </div>
  );
};

export default Inbox;
