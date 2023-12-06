import Image from "next/image";

import { MessageType } from "@/types";

const ChatCard: React.FC<{
  content: string;
  contentType: string;
  upload: string;
  isMine: boolean;
}> = ({ content, contentType, upload, isMine = false }) => {
  const cardClass = isMine ? "bg-blue-500 text-right" : "bg-gray-400";
  return (
    <div className={`flex my-2 ${isMine && "self-end"}`}>
      {!isMine && (
        <Image
          src="/icons/logo.png"
          width={128}
          height={128}
          style={{ width: "30px", height: "30px" }}
          className="mt-2 mr-2"
          alt="bot icon"
        />
      )}
      {contentType === MessageType.Text ? (
        <div className={`text-white`}>
          <p className={`p-2.5 rounded-lg ${cardClass}`}>{content}</p>
        </div>
      ) : (
        <Image
          src={upload}
          width={200}
          height={500}
          alt="chat file"
          style={{ width: "150px", height: "250px" }}
          className="rounded-lg"
        />
      )}
    </div>
  );
};

export default ChatCard;
