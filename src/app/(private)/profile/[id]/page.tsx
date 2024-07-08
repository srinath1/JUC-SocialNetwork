import { getUserInfoById } from "@/server-actions/users";
import React from "react";
import UserbasicDetails from "../_components/UserbasicDetails";
import PendingFollowRequests from "../_components/PendingFollowRequests";
import UserRelatedPosts from "../_components/UserRelatedPosts";

async function ProfilePage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const userInfoResponse = await getUserInfoById(params.id);
  const userInfo = userInfoResponse.data;
  return (
    <div>
      <UserbasicDetails user={userInfo} />
      <PendingFollowRequests user={userInfo} />
      <UserRelatedPosts user={userInfo} />
    </div>
  );
}

export default ProfilePage;
