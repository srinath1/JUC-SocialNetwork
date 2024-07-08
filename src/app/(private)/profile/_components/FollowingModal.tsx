import { UserType } from "@/interfaces";
import React, { useState } from "react";
import { Modal, message } from "antd";
import { getFollowingOfUser } from "@/server-actions/users";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";

const FollowingModal = ({
  showFollowingModal,
  setShowFollowingModal,
  user,
}: {
  showFollowingModal: boolean;
  setShowFollowingModal: (value: boolean) => void;
  user: UserType;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [following, setFollowing] = useState<UserType[]>([]);
  const getData = async () => {
    try {
      setLoading(true);
      const response = await getFollowingOfUser(user._id);
      if (response?.success) {
        setFollowing(response?.data);
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
      title="FOLLOWING"
      open={showFollowingModal}
      centered
      onCancel={() => setShowFollowingModal(false)}
      footer={null}
    >
      {loading && (
        <div className="h-40 flex justify-center items-center">
          <Spinner />
        </div>
      )}
      {!loading && following.length === 0 && (
        <p className="text-center text-gray-500">You are not Following one</p>
      )}
      <div className="flex flex-col gap-5">
        {following?.map((item) => {
          return (
            <div
              className="flex gap-5 items-center border border-gray-200 border-solid p-2 rounded cursor-pointer"
              key={item._id}
              onClick={() => router.push(`/profile/${item._id}`)}
            >
              <img
                src={item.profilePic}
                alt="ProfilePic"
                className="w-10 h-10 rounded-full"
              />
              <div className="text-xl">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-700">{item.email}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default FollowingModal;
