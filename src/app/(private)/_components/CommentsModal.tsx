import { PostType } from "@/interfaces";
import React from "react";
import { message, Modal } from "antd";

import {
  Bookmark,
  Heart,
  Share,
  CircleChevronLeft,
  CircleChevronRight,
  ChevronLeft,
} from "lucide-react";
import { getRootLevelCommentsOfThePost } from "@/server-actions/comments";
import Spinner from "@/components/Spinner";
import Comment from "./Comment";

const CommentsModal = ({
  post,
  setShowCommentsModal,
  showCommentsModal,
}: {
  post: PostType;
  setShowCommentsModal: (show: boolean) => void;
  showCommentsModal: boolean;
}) => {
  const [selectMediaIndex, setSelectMediaIndex] = React.useState(0);
  const [rootLevelComments, setRootLevelComments] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const getRootLevelComments = async () => {
    try {
      setLoading(true);
      const response = await getRootLevelCommentsOfThePost(post?._id);
      if (response.success) {
        setRootLevelComments(response.data);
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
    getRootLevelComments();
  }, []);
  return (
    <Modal
      title="Comments"
      open={showCommentsModal}
      centered
      footer={null}
      onCancel={() => setShowCommentsModal(false)}
      width={1000}
    >
      <div className="grid  mt-5 gap-5 lg:grid-cols-2 ">
        <div className="relative">
          <img
            src={post.media[selectMediaIndex]}
            className="w-full h-[300px]"
          />
          {post.media.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between px-2">
              <CircleChevronLeft
                fill="gray"
                className={`cursor-ponter ${
                  selectMediaIndex === 0 ? "opacity-0" : ""
                }`}
                onClick={() => setSelectMediaIndex(selectMediaIndex - 1)}
                color="white"
              />
              <CircleChevronRight
                fill="gray"
                className={`cursor-ponter ${
                  selectMediaIndex === post.media.length ? "opacity-0" : ""
                }`}
                onClick={() => setSelectMediaIndex(selectMediaIndex + 1)}
                color="white"
              />
            </div>
          )}
          {loading && (
            <div className="h-40 w-full flex items-center justify-center">
              <Spinner />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-5">
          {rootLevelComments.map((comment) => {
            return <Comment comment={comment} />;
          })}
        </div>
      </div>
    </Modal>
  );
};

export default CommentsModal;
