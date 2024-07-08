"use client";
import { getDateTimeFormat } from "@/helpers/dateTimeFormat";
import { PostType } from "@/interfaces";
import { likedpost, unlikedpost } from "@/server-actions/likes";
import useUsersStore, { UsersStoreType } from "@/store/users";
import { Button, message } from "antd";
import {
  Bookmark,
  Heart,
  Share,
  CircleChevronLeft,
  CircleChevronRight,
  ChevronLeft,
} from "lucide-react";
import React from "react";
import LikesModal from "./LikesModal";
import { addNewComment } from "@/server-actions/comments";
import CommentsModal from "./CommentsModal";
import { useRouter } from "next/navigation";
import {
  savePost,
  unsavePost,
  archivePost,
  unarchivePost,
} from "@/server-actions/posts";
import { addNewNotification } from "@/server-actions/Notifications";

type postType =
  | "feed"
  | "uploaded"
  | "tagged"
  | "saved"
  | "archived"
  | "likedBy";

const PostItem = ({
  post,
  type = "feed",
  reloadData = () => {},
  onClick = () => {},
}: {
  post: PostType;
  type: postType;
  reloadData?: any;
  onClick?: any;
}) => {
  const { loggedInUserData }: UsersStoreType = useUsersStore();
  const [selectedMedia, setSelectedMedia] = React.useState(0);
  const [commentText, setCommentText] = React.useState("");
  const [likesCount, setLikesCount] = React.useState(post.likedBy.length);
  const [showLikesModal, setShowLikesModal] = React.useState(false);
  const [commentsCount, setCommentsCount] = React.useState(post.commentsCount);
  const [loading, setLoading] = React.useState(false);
  const [showCommentsModal, setShowCommentsModal] = React.useState(false);
  const [liked, setLiked] = React.useState(
    post.likedBy.includes(loggedInUserData?._id!)
  );
  const [saved, setSaved] = React.useState(
    post.savedBy.includes(loggedInUserData?._id!)
  );
  const router = useRouter();

  const likeHandler = async () => {
    try {
      const response = await likedpost({
        userId: loggedInUserData?._id!,
        postId: post._id,
      });
      if (response.success) {
        setLiked(true);
        setLikesCount(likesCount + 1);
        await addNewNotification({
          user: post.user._id,
          type: "like",
          text: `${loggedInUserData?.name} liked your post`,
          onClickPath: `/post/${post._id}`,
          read: false,
        });
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };
  const unlikeHandler = async () => {
    try {
      const response = await unlikedpost({
        userId: loggedInUserData?._id!,
        postId: post._id,
      });
      if (response.success) {
        setLiked(false);
        setLikesCount(likesCount - 1);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const handleComment = async () => {
    setLoading(true);
    try {
      const payload = {
        post: post._id,
        user: loggedInUserData?._id,
        content: commentText,
      };
      const response = await addNewComment({
        payload,
        postId: post._id,
      });
      if (response.success) {
        setCommentText("");
        setCommentsCount(commentsCount + 1);
        await addNewNotification({
          user: post.user._id,
          type: "comment",
          text: `${loggedInUserData?.name} commented on your post`,
          onClickPath: `/post/${post._id}`,
          read: false,
        });
        message.success(response.message);
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const savedHandler = async () => {
    try {
      const response = await savePost({
        userId: loggedInUserData?._id!,
        postId: post._id,
      });
      if (response?.success) {
        setSaved(true);
        reloadData();
      } else {
        message.error(response?.message);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };
  const unsavedHandler = async () => {
    try {
      const response = await unsavePost({
        userId: loggedInUserData?._id!,
        postId: post._id,
      });
      if (response?.success) {
        setSaved(false);
        reloadData();
      } else {
        message.error(response?.message);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };
  const archivePostHandler = async () => {
    try {
      setLoading(true);
      const response = await archivePost(post._id);
      if (response.success) {
        message.success(response.message);
        reloadData();
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const unarchiveHandler = async () => {
    try {
      setLoading(true);
      const response = await unarchivePost(post._id);
      if (response.success) {
        message.success(response.message);
        reloadData();
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col  border border-gray-300 border-solid mt-7">
      <div className="flex gap-5 bg-gray-100 p-3 items-center">
        <img src={post.user.profilePic} className="w-10 h-10 rounded-full" />
        <div
          className="flex flex-col cursor-pointer"
          onClick={() => router.push(`/profile/${post.user._id}`)}
        >
          <span className="text-sm">{post.user.name}</span>
          <span className="text-xs text-gray-700">
            {getDateTimeFormat(post.createdAt)}
          </span>
        </div>
      </div>
      <div className="relative cursor-pointer" onClick={onClick}>
        <img src={post.media[selectedMedia]} className="w-full h-[450px]" />
        {post.media.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-2">
            <CircleChevronLeft
              fill="gray"
              className={`cursor-ponter ${
                selectedMedia === 0 ? "opacity-0" : ""
              }`}
              onClick={() => setSelectedMedia(selectedMedia - 1)}
              color="white"
            />
            <CircleChevronRight
              fill="gray"
              className={`cursor-ponter ${
                selectedMedia === post.media.length ? "opacity-0" : ""
              }`}
              onClick={() => setSelectedMedia(selectedMedia + 1)}
              color="white"
            />
          </div>
        )}
      </div>{" "}
      <div className="flex flex-col p-2">
        <p className="mt-5 text-sm text-gray-500">
          <b className="text-primary">@ {post.user.name}</b>
          {"  "} {post.caption}
        </p>
        <p className="mt-t text-sm text-blue-600">{post.hashTags.toString()}</p>
        <div className="flex justify-between mt-5">
          <div className="flex gap-5">
            <Heart
              size={16}
              fill={liked ? "red" : "none"}
              onClick={liked ? unlikeHandler : likeHandler}
              className="cursor-pointer"
            />
            <Share size={16} className="cursor-pointer" />
          </div>
          <Bookmark
            size={16}
            fill={saved ? "blue" : "none"}
            onClick={saved ? unsavedHandler : savedHandler}
            className="cursor-pointer"
          />
        </div>
        <div className="flex gap-10 mt-3 text-sm font-semibold">
          <p
            className="text-sm cursor-pointer font-semibold"
            onClick={() => {
              if (likesCount) {
                setShowLikesModal(true);
              }
            }}
          >
            {likesCount} Likes
          </p>
          <p
            className="text-sm cursor-pointer"
            onClick={() => {
              if (commentsCount) {
                setShowCommentsModal(true);
              }
            }}
          >
            {commentsCount || 0} Comments
          </p>
        </div>
        {type === "feed" && (
          <div className="flex gap-5 mt-3 items-center">
            <input
              type="text"
              value={commentText}
              placeholder="Add a comment"
              onChange={(e) => setCommentText(e.target.value)}
              className="bg-gray-200 px-5 py-3 border-none focus:outline-none w-[85%] rounded"
            />{" "}
            {commentText && (
              <Button type="link" onClick={handleComment} loading={loading}>
                Post
              </Button>
            )}{" "}
          </div>
        )}
        {type === "uploaded" && post.user._id === loggedInUserData?._id && (
          <div className="flex gap-5 mt-3 items-center">
            {!post.isArchived ? (
              <Button
                danger
                type="primary"
                size="small"
                onClick={archivePostHandler}
              >
                Archive
              </Button>
            ) : (
              <Button type="primary" size="small" onClick={unarchiveHandler}>
                Unarchive
              </Button>
            )}
            <Button size="small" type="primary">
              Edit
            </Button>
          </div>
        )}
      </div>
      {showLikesModal && (
        <LikesModal
          post={post}
          showLikesModal={showLikesModal}
          setShowLikesModal={setShowLikesModal}
        />
      )}
      {showCommentsModal && (
        <CommentsModal
          post={post}
          showCommentsModal={showCommentsModal}
          setShowCommentsModal={setShowCommentsModal}
        />
      )}
      {}
    </div>
  );
};

export default PostItem;
