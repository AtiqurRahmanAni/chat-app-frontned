import ThreadCard from "./ThreadCard";
import { ThreadParticipant } from "@/types";

type HandleThreadClick = (threadId: number) => void;

const SideBar: React.FC<{
  threadParticipants: ThreadParticipant[];
  handleThreadClick: HandleThreadClick;
  userEmail: string;
}> = ({ threadParticipants, handleThreadClick, userEmail }) => {
  return (
    <div className=" min-h-fit text-black mt-20">
      {threadParticipants.map((obj, index) => (
        <div key={index} onClick={() => handleThreadClick(obj.id)}>
          <ThreadCard
            email={
              obj.participants_emails[0] !== userEmail
                ? obj.participants_emails[0]
                : obj.participants_emails[1]
            }
          />
        </div>
      ))}
    </div>
  );
};

export default SideBar;
