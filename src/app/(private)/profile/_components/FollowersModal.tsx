import { UserType } from "@/interfaces";
import React, { useState } from "react";
import { Modal, message } from "antd";
import { getFollowersOfUser } from "@/server-actions/users";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";

const FollowersModal = ({
  showFollowersModal,
  setShowFollowersModal,
  user,
}: {
  showFollowersModal: boolean;
  setShowFollowersModal: (value: boolean) => void;
  user: UserType;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [followers, setFollowers] = useState<UserType[]>([]);
  const getData = async () => {
    try {
      setLoading(true);
      const response = await getFollowersOfUser(user._id);
      if (response?.success) {
        setFollowers(response?.data);
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    getData();
  }, []);
  return (
    <Modal
      title="Followers"
      open={showFollowersModal}
      centered
      onCancel={() => setShowFollowersModal(false)}
      footer={null}
    >
      {loading && (
        <div className="h-40 flex justify-center items-center">
          <Spinner />
        </div>
      )}
      {!loading && followers.length === 0 && (
        <p className="text-center text-gray-500">No Followers</p>
      )}
      <div className="flex flex-col gap-5">
        {followers?.map((follower) => {
          return (
            <div
              className="flex gap-5 items-center border border-gray-200 border-solid p-2 rounded cursor-pointer"
              key={follower._id}
              onClick={() => router.push(`/profile/${follower._id}`)}
            >
              <img
                src={follower.profilePic}
                alt="ProfilePic"
                className="w-10 h-10 rounded-full"
              />
              <div className="text-xl">
                <p className="font-semibold">{follower.name}</p>
                <p className="text-sm text-gray-700">{follower.email}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default FollowersModal;
