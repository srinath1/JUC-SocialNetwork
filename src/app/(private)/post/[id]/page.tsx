import { getPostById } from "@/server-actions/posts";
import React from "react";
import PostItem from "../../_components/PostItem";

const SinglePost = async ({ params }: { params: { id: string } }) => {
  const response = await getPostById(params?.id);
  const post = response?.data;
  if (!post) {
    return <div className="text-gray-500 text-sm">Post Not Found</div>;
  }
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold text-primary">Post Info</h1>
      <div className="lg:w-[65%] lg:h-[65%]">
        <PostItem post={post} type="feed" />
      </div>{" "}
    </div>
  );
};

export default SinglePost;
