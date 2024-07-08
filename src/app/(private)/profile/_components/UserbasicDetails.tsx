"use client";
import { UserType } from "@/interfaces";
import useUsersStore, { UsersStoreType } from "@/store/users";
import { Button, message } from "antd";
import React, { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import {
  cancelFollowRequest,
  sendFollowRequest,
  unfollowUser,
} from "@/server-actions/FollowRequest";
import FollowersModal from "./FollowersModal";
import FollowingModal from "./FollowingModal";
import { addNewNotification } from "@/server-actions/Notifications";

const UserbasicDetails = ({ user }: { user: UserType }) => {
  const [loading, setLoading] = useState<
    "sending" | "cancel" | "unfollow" | ""
  >("");
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] =
    useState<boolean>(false);
  const { loggedInUserData, setLoggedInUserData }: UsersStoreType =
    useUsersStore();
  const showEditProfileBtn = user?._id === loggedInUserData?._id;

  const followRequestSent = loggedInUserData?.followRequestsSent?.includes(
    user?._id
  );
  const alreadyFollowing = loggedInUserData?.following?.includes(user?._id);
  //
  const showFollowBtn =
    user?._id !== loggedInUserData?._id &&
    !followRequestSent &&
    !alreadyFollowing;
  const followHandler = async () => {
    try {
      setLoading("sending");
      const response = await sendFollowRequest({
        followRequestReceiverid: user._id,
        followRequestSenderId: loggedInUserData?._id || "",
      });
      if (response?.success) {
        message.success(response?.message);
        setLoggedInUserData(response.data);
        await addNewNotification({
          user: user._id,
          type: "follow-request",
          text: `${loggedInUserData?.name} sent you a follow request`,
          read: false,
          onClickPath: `/profile/${user?._id}`,
        });
      } else {
        message.error(response?.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading("");
    }
  };

  const cancelRequestHandler = async () => {
    try {
      setLoading("cancel");
      const response = await cancelFollowRequest({
        followRequestReceiverid: user._id,
        followRequestSenderId: loggedInUserData?._id || "",
      });
      if (response.success) {
        message.success(response?.message);
        setLoggedInUserData(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error?.message);
    } finally {
      setLoading("");
    }
  };

  const unfollowHandler = async () => {
    try {
      setLoading("unfollow");
      const response = await unfollowUser({
        senderId: loggedInUserData?._id || "",
        reciverId: user._id,
      });
      if (response?.success) {
        message.success(response?.message);
        setLoggedInUserData(response?.data);
      } else {
        message.error(response?.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading("");
    }
  };

  const canSeeFollowersAndFollowing =
    loggedInUserData?._id === user?._id ||
    !user?.isPrivateAccount ||
    (user?.isPrivateAccount && alreadyFollowing);

  return (
    <div className="flex lg:flex-row flex-col gap-10 lg:items-center px-5">
      <div>
        <img
          src={user?.profilePic}
          alt={user?.name}
          className="w-40 h-40 rounded-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex gap-5 items-center">
          <span className="font-semibold text-semibold text-primary">
            {user?.name}
          </span>
          {showEditProfileBtn && (
            <Button
              type="primary"
              size="small"
              onClick={() => setShowEditProfileModal(true)}
            >
              Edit Profile
            </Button>
          )}
          {showFollowBtn && (
            <Button
              type="primary"
              size="small"
              loading={loading === "sending"}
              onClick={followHandler}
            >
              Follow
            </Button>
          )}
          {followRequestSent && (
            <div className="flex items-center gap-5">
              <span className="text-gray-500 text-sm">Follow Request sent</span>
              <Button
                type="primary"
                size="small"
                onClick={cancelRequestHandler}
                loading={loading === "cancel"}
                danger
              >
                Cancel Request
              </Button>
            </div>
          )}
          {alreadyFollowing && (
            <div className="flex items-center gap-5">
              <span className="text-gray-500 text-sm">Following</span>
              <Button
                type="primary"
                size="small"
                onClick={unfollowHandler}
                loading={loading === "unfollow"}
                danger
              >
                Unfollow
              </Button>
            </div>
          )}
        </div>
        <div className="flex gap-5 text-gray-500 text-sm font-bold">
          {" "}
          <div className="flex gap-1">
            <span>0</span>
            <span>Posts</span>
          </div>
          <div className="flex gap-1">
            <span>{user?.followers.length}</span>
            <span
              className="underline cursor-pointer"
              onClick={() => {
                if (canSeeFollowersAndFollowing) setShowFollowersModal(true);
              }}
            >
              Followers
            </span>
          </div>
          <div className="flex gap-1">
            <span>{user?.following.length}</span>
            <span
              className="underline cursor-pointer"
              onClick={() => {
                if (canSeeFollowersAndFollowing) setShowFollowingModal(true);
              }}
            >
              Following
            </span>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          {user?.bio || "This user has no bio yet "}
        </p>
      </div>
      {showEditProfileModal && (
        <EditProfileModal
          user={user}
          showEditProfileModal={showEditProfileModal}
          setShowEditProfileModal={setShowEditProfileModal}
        />
      )}
      {showFollowersModal && (
        <FollowersModal
          user={user}
          showFollowersModal={showFollowersModal}
          setShowFollowersModal={setShowFollowersModal}
        />
      )}
      {showFollowingModal && (
        <FollowingModal
          showFollowingModal={showFollowingModal}
          setShowFollowingModal={setShowFollowingModal}
          user={user}
        />
      )}
    </div>
  );
};

export default UserbasicDetails;
