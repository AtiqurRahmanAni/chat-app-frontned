"use client";
import { useState, useEffect, useContext } from "react";
import SideBar from "@/components/SideBar";
import { fetchThread } from "@/actions/fetch-thread-action";
import toast from "react-hot-toast";
import { ThreadParticipant } from "@/types";
import { AuthContext } from "@/contexts/AuthContext";
import Inbox from "@/components/Inbox";

const Chat: React.FC = () => {
  const [threadId, setThreadId] = useState(-1);
  const [threads, setThreads] = useState<ThreadParticipant[]>([]);

  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const getAllThreads = async () => {
      const response = await fetchThread();
      if ("error" in response) {
        toast.error(response.error);
      } else {
        setThreads(response);
      }
    };
    getAllThreads();
  }, []);

  const handleClickedThread = (threadId: number): void => {
    setThreadId(threadId);
  };

  return (
    <div className="flex">
      <SideBar
        threadParticipants={threads}
        handleThreadClick={handleClickedThread}
        userEmail={userInfo?.email as string}
      />
      {threadId !== -1 && <Inbox threadId={threadId} />}
    </div>
  );
};

export default Chat;
