import { useParams } from "react-router-dom";
import { useUserStore } from "@/stores/useUserStore";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";

const UserDetailsPage = () => {
  const { id } = useParams<{ id?: string }>();
  const users = useUserStore((s) => s.users);
  //  find the user
  const currentUser = users.find((u) => u._id === id);
  return (
    <section>
      {/* heading */}
      <div className="flex justify-between items-center">
        <h5>User Details</h5>
        <div className="flex gap-5">
          <Button variant="outline">Back to user list</Button>
          <Button variant="secondary">Suspend user</Button>
          <Button variant="secondary">Enable user</Button>
          <Button>Reset Password</Button>
          <Button variant="destructive">
            <Delete />
            Delete User
          </Button>
        </div>
      </div>

      {/* details */}
      <div className="flex gap-10 mt-[36px] bg-white rounded-[10px] p-3 backdrop-blur-2xl">
        {/* image */}
        <div className="w-[94px] h-[94px] rounded-full overflow-hidden">
          <img
            src={currentUser?.profilePicture}
            alt={currentUser?.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* name */}
        <div>
          <div>
            <h6 className="text-[28px] font-medium text-[#333333]">
              {currentUser?.name}
            </h6>
            <span>{currentUser?.isBlocked ? "Suspended" : "Active"}</span>
            <div>
              <p>{currentUser?.phone}</p>
            </div>
          </div>
          <p>{currentUser?.email}</p>
        </div>
      </div>
    </section>
  );
};

export default UserDetailsPage;
