"use server";
import CommentModel from "@/models/commentModel";
import PostModel from "@/models/postmodel";
import { connectToMongoDB } from "@/config/database";
connectToMongoDB();
export const addNewComment = async ({
  payload,
  postId,
}: {
  payload: any;
  postId: string;
}) => {
  try {
    await CommentModel.create(payload);
    await PostModel.findByIdAndUpdate(postId, {
      $inc: { commentsCount: 1 },
    });
    return {
      success: true,
      message: "Comments added Successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const replyToComment = async ({
  payload,
  postId,
}: {
  payload: any;
  postId: string;
}) => {
  try {
    await CommentModel.create(payload);
    await PostModel.findByIdAndUpdate(postId, {
      $inc: { commentsCount: 1 },
    });
    await CommentModel.findByIdAndUpdate(payload.replyTo, {
      $inc: { repliesCount: 1 },
    });
    return {
      success: true,
      message: "Replied to the comment successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getRootLevelCommentsOfThePost = async (postId: string) => {
  try {
    const comments = await CommentModel.find({
      post: postId,
      isReply: false,
    }).populate("user");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(comments)),
    };
  } catch (error: any) {
    return {
      message: error.message,
      success: false,
    };
  }
};

export const getRepliesOfComment = async (commentId: string) => {
  try {
    const replies = await CommentModel.find({
      replyTo: commentId,
    }).populate("user");
    return {
      success: true,
      data: JSON.parse(JSON.stringify(replies)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
