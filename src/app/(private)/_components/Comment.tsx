import { getDateTimeFormat } from "@/helpers/dateTimeFormat";
import { CommentType } from "@/interfaces";
import { getRepliesOfComment, replyToComment } from "@/server-actions/comments";
import { addNewNotification } from "@/server-actions/Notifications";
import useUsersStore, { UsersStoreType } from "@/store/users";
import { Button, message } from "antd";
import React from "react";

const Comment = ({ comment }: { comment: CommentType }) => {
  const [showReplyInput, setShowreplyInput] = React.useState(false);
  const [replyText, setReplyText] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { loggedInUserData }: UsersStoreType = useUsersStore();
  const [repliesCount, setRepliesCount] = React.useState(comment.repliesCount);
  const [showReplies, setShowReplies] = React.useState(false);
  const [replies, setReplies] = React.useState<CommentType[]>([]);
  const handleReplyText = async () => {
    try {
      setLoading(true);
      const payload = {
        user: loggedInUserData?._id,
        post: comment.post,
        content: replyText,
        isReply: true,
        replyTo: comment._id,
      };
      const response = await replyToComment({
        payload,
        postId: comment.post,
      });
      if (response?.success) {
        message.success(response.message);
        setReplyText("");
        setShowreplyInput(false);
        setRepliesCount(repliesCount + 1);
        addNewNotification({
          user: comment.user._id,
          type: "comment",
          text: `${loggedInUserData?.name} replied to your comment`,
          read: false,
          onClickPath: `/post/${comment.post}`,
        });
      } else {
        message.error(response?.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const getReplies = async () => {
    try {
      setLoading(true);
      const response = await getRepliesOfComment(comment._id);
      if (response.success) {
        setReplies(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getShowReplyText = () => {
    if (!loading && !showReplies) {
      return ` ... view replies...`;
    }
    if (loading) {
      return "Loading replies....";
    }
    return " Hide Replies...";
  };
  return (
    <div className="flex gap-5">
      <img src={comment.user.profilePic} className="w-10 h-10 rounded-full" />
      <div className="flex flex-col w-full">
        <div className="flex gap-3">
          <span className="font-bold text-sm">@ {comment.user.name}</span>
          <span className="text-gray-500 text-sm">{comment.content}</span>
        </div>
        <div className="flex gap-5">
          <span className="text-gray-500 text-xs">
            {getDateTimeFormat(comment.createdAt)}
          </span>
          <span
            className="text-xs text-gray-500 cursor-pointer"
            onClick={() => {
              setShowreplyInput(!showReplyInput);
              setShowReplies(false);
            }}
          >
            {showReplyInput ? "cancel" : "Reply"}
          </span>
        </div>
        {showReplyInput && (
          <div className="flex gap-5">
            <input
              type="text"
              placeholder="Reply to this comment"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="border px-5 py-3  border-gray-700 focus:outline-none w-[85%] rounded"
            />
            {replyText && (
              <Button onClick={handleReplyText} loading={loading} type="text">
                Post
              </Button>
            )}
          </div>
        )}
        {repliesCount > 0 && (
          <span
            className="text-xs text-gray-500 cursor-pointer"
            onClick={() => {
              if (!showReplies) {
                getReplies();
                setShowReplies(true);
              } else {
                setShowReplies(false);
                setReplies([]);
              }
            }}
          >
            {getShowReplyText()}
          </span>
        )}
        <div className=" flex flex-col gap-5 ml-10">
          {showReplies &&
            replies.map((reply) => <Comment key={reply._id} comment={reply} />)}
        </div>
      </div>
    </div>
  );
};

export default Comment;
