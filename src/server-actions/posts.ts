"use server";

import { connectToMongoDB } from "@/config/database";
import PostModel from "@/models/postmodel";
import { getCurrentUserFromMongoDB } from "./users";
import { revalidatePath } from "next/cache";
import { stringify } from "querystring";

connectToMongoDB();

export const uploadNewPost = async (payload: any) => {
  try {
    await PostModel.create(payload);
    revalidatePath("/");
    return {
      success: true,
      message: "Post uploaded successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getTimelineOfLoggedInuser = async () => {
  try {
    const currentUser = await getCurrentUserFromMongoDB();
    const currentUserId = currentUser.data._id;
    const posts = await PostModel.find({
      $or: [
        { user: currentUserId },
        { user: { $in: currentUser.data.following } },
      ],
      isArchived: false,
    })
      .populate("user")
      .sort({ crteatedAt: -1 });
    return {
      success: true,
      data: JSON.parse(JSON.stringify(posts)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
export const getPostsOfUsersByType = async ({
  userId,
  type,
}: {
  userId: string;
  type: "uploaded" | "tagged" | "saved" | "liked" | "archived";
}) => {
  try {
    let postsToReturn: any[] = [];
    if (type === "uploaded") {
      postsToReturn = await PostModel.find({
        user: userId,
        isArchived: false,
      }).populate("user");
    } else if (type === "tagged") {
      postsToReturn = await PostModel.find({
        tags: {
          $in: [userId],
        },
      }).populate("user");
    } else if (type === "saved") {
      postsToReturn = await PostModel.find({
        savedBy: {
          $in: [userId],
        },
      }).populate("user");
    } else if (type === "archived") {
      postsToReturn = await PostModel.find({
        user: userId,
        isArchived: true,
      }).populate("user");
    }
    return {
      success: true,
      data: JSON.parse(JSON.stringify(postsToReturn)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const savePost = async ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) => {
  try {
    await PostModel.findByIdAndUpdate(postId, {
      $addToSet: { savedBy: userId },
    });
    return {
      success: true,
      message: "Post saved successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const unsavePost = async ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) => {
  try {
    const data = await PostModel.findByIdAndUpdate(postId, {
      $pull: { savedBy: userId },
    });

    return {
      success: true,
      message: "Post unsaved successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
export const archivePost = async (postId: string) => {
  try {
    await PostModel.findByIdAndUpdate(postId, {
      isArchived: true,
    });

    return {
      success: true,
      message: "Post archived successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const unarchivePost = async (postId: string) => {
  try {
    await PostModel.findByIdAndUpdate(postId, {
      isArchived: false,
    });

    return {
      success: true,
      message: "Post unarchived successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const searchPosts = async (searchValue: string) => {
  try {
    const posts = await PostModel.find({
      $or: [
        { caption: { $regex: searchValue, $options: "i" } },
        { hashTags: { $in: [searchValue] } },
      ],
    }).populate("user");
    return {
      success: true,
      data: JSON.parse(JSON.stringify(posts)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getPostById = async (postId: string) => {
  try {
    const post = await PostModel.findById(postId).populate("user");
    return {
      success: false,
      data: JSON.parse(JSON.stringify(post)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
