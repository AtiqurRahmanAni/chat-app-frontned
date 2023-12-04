import React from "react";

const ThreadCard: React.FC<{
  email: string;
}> = ({ email }) => {
  return (
    <div className="bg-gray-400 min-h-fit text-black hover:bg-gray-200 cursor-pointer">
      <div className="p-2 border-2">
        <span>{email}</span>
      </div>
    </div>
  );
};

export default ThreadCard;
