"use client";
import { searchUsers } from "@/server-actions/users";
import { Button, Input, message, Radio } from "antd";
import React from "react";
import UserSearchResult from "./_components/UserSearchResult";
import { searchPosts } from "@/server-actions/posts";
import PostsSearchResult from "./_components/PostsSearchResult";

const SearchPage = () => {
  const [users, setUsers] = React.useState([]);
  const [posts, setPosts] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [searchFor, setSearchFor] = React.useState<"users" | "posts">("users");
  const searchHandler = async () => {
    try {
      setLoading(true);
      let response: any = null;
      if (searchFor === "users") {
        response = await searchUsers(searchValue);
      } else {
        response = await searchPosts(searchValue);
      }

      if (response.success) {
        if (searchFor === "users") {
          setUsers(response.data);
        } else {
          setPosts(response.data);
        }
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h1 className="text-xl font-bold text-primary ">
        Search Users,Hashtags,Posts
      </h1>
      <div className="flex gap-5 mt-4">
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search posts..."
        />
        <Button type="primary" onClick={searchHandler} loading={loading}>
          Button
        </Button>
      </div>
      <div className="mt-5 flex  gap-5 items-center">
        <span>Search For</span>
        <Radio.Group
          onChange={(e) => setSearchFor(e.target.value)}
          value={searchFor}
        >
          <Radio value="users">Users</Radio>
          <Radio value="posts">Posts</Radio>
        </Radio.Group>
      </div>
      {searchFor === "users" ? (
        <UserSearchResult users={users} />
      ) : (
        <PostsSearchResult posts={posts} />
      )}
    </div>
  );
};

export default SearchPage;
