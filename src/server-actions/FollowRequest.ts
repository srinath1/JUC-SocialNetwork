"use server";
import { connectToMongoDB } from "@/config/database";
connectToMongoDB();
import UserModel from "@/models/user-model";
import { revalidatePath } from "next/cache";
export const sendFollowRequest = async ({
  followRequestReceiverid,
  followRequestSenderId,
}: {
  followRequestReceiverid: string;
  followRequestSenderId: string;
}) => {
  try {
    const newDoc = await UserModel.findByIdAndUpdate(
      followRequestSenderId,
      {
        $push: { followRequestsSent: followRequestReceiverid },
      },
      { new: true }
    );
    await UserModel.findByIdAndUpdate(followRequestReceiverid, {
      $push: { followRequestsReceived: followRequestSenderId },
    });
    revalidatePath(`/profile/${followRequestReceiverid}`);

    return {
      success: true,
      message: "Follow request sent successfully",
      data: JSON.parse(JSON.stringify(newDoc)),
    };
  } catch (error: any) {}
};
export const acceptFollowRequest = async ({
  followRequestReceiverid,
  followRequestSenderId,
}: {
  followRequestReceiverid: string;
  followRequestSenderId: string;
}) => {
  try {
    await UserModel.findByIdAndUpdate(followRequestReceiverid, {
      $push: { followers: followRequestSenderId },
      $pull: { followRequestsReceived: followRequestSenderId },
    });

    await UserModel.findByIdAndUpdate(followRequestSenderId, {
      $push: { following: followRequestReceiverid },
      $pull: { followRequestsSent: followRequestReceiverid },
    });

    return {
      success: true,
      message: "Follow request accepted successfully",
    };
  } catch (error: any) {}
};
export const rejectFollowRequest = async ({
  followRequestReceiverid,
  followRequestSenderId,
}: {
  followRequestReceiverid: string;
  followRequestSenderId: string;
}) => {
  try {
    await UserModel.findByIdAndUpdate(followRequestReceiverid, {
      $pull: { followRequestsReceived: followRequestSenderId },
    });
    await UserModel.findByIdAndUpdate(followRequestSenderId, {
      $pull: { followRequestsSent: followRequestReceiverid },
    });
    return {
      success: true,
      message: "Follow request reject successfully",
    };
  } catch (error: any) {}
};

export const getFollowRequestRecieved = async (userId: string) => {
  try {
    const usersWithFollowRequests = await UserModel.findById(userId).populate(
      "followRequestsReceived"
    );
    return {
      success: true,
      data: JSON.parse(
        JSON.stringify(usersWithFollowRequests?.followRequestsReceived)
      ),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
export const cancelFollowRequest = async ({
  followRequestReceiverid,
  followRequestSenderId,
}: {
  followRequestReceiverid: string;
  followRequestSenderId: string;
}) => {
  try {
    const newDoc = await UserModel.findByIdAndUpdate(followRequestReceiverid, {
      $pull: { followRequestsReceived: followRequestSenderId },
    });

    await UserModel.findByIdAndUpdate(
      followRequestSenderId,
      {
        $pull: { followRequestsSent: followRequestReceiverid },
      },
      { new: true }
    );
    return {
      success: true,
      message: "Follow request cancelled successfully",
      data: JSON.parse(JSON.stringify(newDoc)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const unfollowUser = async ({
  senderId = "",
  reciverId = "",
}: {
  senderId: string;
  reciverId: string;
}) => {
  try {
    const newdoc = await UserModel.findByIdAndUpdate(
      senderId,
      {
        $pull: { following: reciverId },
      },
      { new: true }
    );
    await UserModel.findByIdAndUpdate(reciverId, {
      $pull: { followers: senderId },
    });
    return {
      success: true,
      message: "Unfollowed successfully",
      data: JSON.parse(JSON.stringify(newdoc)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
