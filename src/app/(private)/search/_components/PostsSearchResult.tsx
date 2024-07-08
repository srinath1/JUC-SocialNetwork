"use client";
import { PostType } from "@/interfaces";
import React from "react";
import PostItem from "../../_components/PostItem";
import { useRouter } from "next/navigation";

const PostsSearchResult = ({ posts }: { posts: PostType[] }) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-7">
      {posts.map((post) => (
        <PostItem
          post={post}
          key={post._id}
          type="feed"
          // reloadData={() => {}}
          onClick={() => {
            router.push(`/post/${post._id}`);
          }}
        />
      ))}
    </div>
  );
};

export default PostsSearchResult;
