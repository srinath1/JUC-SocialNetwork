import { getTimelineOfLoggedInuser } from "@/server-actions/posts";
import React from "react";
import PostItem from "./PostItem";

const Timeline = async () => {
  const postResponse = await getTimelineOfLoggedInuser();
  if (!postResponse.success) {
    return <div>failed to load timeline posts</div>;
  }
  if (postResponse?.data?.length === 0) {
    return <div className="mt-10 text-gray-500 text-sm">No Posts To Show</div>;
  }
  return (
    <div className="flex flex-col gap-7">
      {postResponse.data.map((post: any) => (
        <PostItem key={post._id} post={post} type="feed" />
      ))}
    </div>
  );
};

export default Timeline;
