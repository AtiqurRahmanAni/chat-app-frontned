import Image from "next/image";

const ChatCard: React.FC<{ isMine: boolean; message: string }> = ({
  isMine = false,
  message,
}) => {
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
      <div className={`text-white`}>
        <p className={`p-2.5 rounded-lg ${cardClass}`}>{message}</p>
      </div>
    </div>
  );
};

export default ChatCard;
