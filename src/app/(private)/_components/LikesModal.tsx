import { PostType, UserType } from "@/interfaces";
import { getPostLikes } from "@/server-actions/likes";
import { message, Modal } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

const LikesModal = ({
  showLikesModal,
  setShowLikesModal,
  post,
}: {
  showLikesModal: boolean;
  setShowLikesModal: (show: boolean) => void;
  post: PostType;
}) => {
  const [loading, setLoading] = React.useState(false);
  const [usersLiked, setUsersLiked] = React.useState<UserType[]>([]);
  const router = useRouter();
  const getLikes = async () => {
    try {
      setLoading(true);
      const response = (await getPostLikes(post._id)) as any;
      if (response.success) {
        setUsersLiked(response.data);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    getLikes();
  }, [showLikesModal]);

  return (
    <Modal
      open={showLikesModal}
      onCancel={() => setShowLikesModal(false)}
      footer={null}
      centered
      title="Likes"
    >
      <div className="flex flex-col gap-5">
        {usersLiked?.map((user) => {
          return (
            <div
              className="flex gap-5 items-center border border-gray-200 border-solid p-2 rounded cursor-pointer"
              key={user._id}
              onClick={() => router.push(`/profile/${user._id}`)}
            >
              <img
                src={user.profilePic}
                alt="ProfilePic"
                className="w-10 h-10 rounded-full"
              />
              <div className="text-xl">
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-700">{user.email}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default LikesModal;
