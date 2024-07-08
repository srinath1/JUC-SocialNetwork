"use client";
import { UserType } from "@/interfaces";
import {
  acceptFollowRequest,
  getFollowRequestRecieved,
  rejectFollowRequest,
} from "@/server-actions/FollowRequest";
import { addNewNotification } from "@/server-actions/Notifications";
import useUsersStore, { UsersStoreType } from "@/store/users";
import { Button, message } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const PendingFollowRequests = ({ user }: { user: UserType }) => {
  type loadingType = "accept" | "reject" | "";
  const router = useRouter();
  const [followRequests, setFollowRequests] = useState([]);
  const { loggedInUserData }: UsersStoreType = useUsersStore();
  const [loading, setLoading] = useState<loadingType>("");
  if (user._id !== loggedInUserData?._id) {
    return null;
  }
  const fetchFollowRequests = async () => {
    try {
      const response = await getFollowRequestRecieved(
        loggedInUserData?._id || ""
      );
      if (response.success) {
        setFollowRequests(response?.data);
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };
  useEffect(() => {
    fetchFollowRequests();
  }, []);

  const handleAcceptFollowRequest = async (senderId: string) => {
    try {
      setLoading("accept");
      const response = await acceptFollowRequest({
        followRequestReceiverid: loggedInUserData?._id || "",
        followRequestSenderId: senderId,
      });
      if (response?.success) {
        message.success(response?.message);
        fetchFollowRequests();
        await addNewNotification({
          user: senderId,
          type: "follow-request",
          text: `${loggedInUserData?.name} accepted your request`,
          read: false,
          onClickPath: `/profile/${senderId}`,
        });
      } else {
        message.error(response?.message);
      }
    } catch (error: any) {
      message.error(error?.message);
    } finally {
      setLoading("");
    }
  };
  const handleRejecttFollowRequest = async (senderId: string) => {
    try {
      setLoading("reject");
      const response = await rejectFollowRequest({
        followRequestReceiverid: loggedInUserData?._id || "",
        followRequestSenderId: senderId,
      });
      if (response?.success) {
        message.success(response?.message);
        fetchFollowRequests();
      } else {
        message.error(response?.message);
      }
    } catch (error: any) {
      message.error(error?.message);
    } finally {
      setLoading("");
    }
  };
  return (
    <div className="mt-10 p-5 bg-gray-50 border-gray-200 border-solid  ">
      <h1 className="text-sm text-primary ">Pending Follow Requests</h1>
      {followRequests.length === 0 && !loading && (
        <span className="text-sm text-primary">No Pending Requests</span>
      )}
      {followRequests.length > 0 && (
        <div className="flex flex-wrap gap-5 mt-7">
          {followRequests.map((sender: UserType) => (
            <div className="flex  gap-5 items-center bg-gray-200 p-2 border border-solid border-gray-300 cursor-pointer">
              <img
                src={sender.profilePic}
                alt={sender.name}
                className="w-12 h-12 rounded-full object-cover"
              ></img>
              <div className=" flex flex-col">
                <span className="text-gray-700 text-sm">{sender.name}</span>
                <div className="flex  gap-5">
                  <Button
                    size="small"
                    onClick={() => router.push(`/profile/${sender._id}`)}
                  >
                    View Profile
                  </Button>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => handleAcceptFollowRequest(sender._id)}
                    loading={loading === "accept"}
                  >
                    Accept
                  </Button>
                  <Button
                    size="small"
                    danger
                    onClick={() => handleRejecttFollowRequest(sender._id)}
                    loading={loading === "reject"}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingFollowRequests;
