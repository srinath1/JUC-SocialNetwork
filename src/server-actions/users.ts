"use server";

import { connectToMongoDB } from "@/config/database";
import UserModel from "@/models/user-model";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
connectToMongoDB();

export const saveUser = async (payload: any) => {
  try {
    const user = new UserModel(payload);
    await user.save();
    return {
      success: true,
      message: "User saved successfully",
      data: JSON.parse(JSON.stringify(user)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getCurrentUserFromMongoDB = async () => {
  try {
    const clerkUserData = await currentUser();
    const user = await UserModel.findOne({ clerkUserId: clerkUserData?.id });
    if (user) {
      return {
        success: true,
        data: JSON.parse(JSON.stringify(user)),
      };
    }

    const newUser = await saveUser({
      name: clerkUserData?.firstName + " " + clerkUserData?.lastName,
      email: clerkUserData?.emailAddresses[0].emailAddress,
      clerkUserId: clerkUserData?.id,
      profilePic: clerkUserData?.imageUrl,
    });

    if (newUser.success) {
      return {
        success: true,
        data: JSON.parse(JSON.stringify(newUser)),
      };
    } else {
      return {
        success: false,
        message: "User not found and failed to create new user",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
export const getUserInfoById = async (id: string) => {
  try {
    const response = await UserModel.findById(id);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(response)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const updateUserProfile = async ({
  payload,
  userId,
}: {
  payload: any;
  userId: string;
}) => {
  try {
    await UserModel.findByIdAndUpdate(userId, payload);
    revalidatePath(`/profile/${userId}`);
    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const searchUsers = async (searchValue: string) => {
  try {
    const users = await UserModel.find({
      name: { $regex: searchValue, $options: "i" },
    });
    return {
      success: true,
      data: JSON.parse(JSON.stringify(users)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getFollowersOfUser = async (userId: string) => {
  try {
    const userWithFollowers = await UserModel.findById(userId).populate(
      "followers"
    );
    return {
      data: JSON.parse(JSON.stringify(userWithFollowers?.followers)),
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
export const getFollowingOfUser = async (userId: string) => {
  try {
    const userWithFollowing = await UserModel.findById(userId).populate(
      "following"
    );
    return {
      data: JSON.parse(JSON.stringify(userWithFollowing?.following)),
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
