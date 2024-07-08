"use client";
import { PostType, UserType } from "@/interfaces";
import { getPostsOfUsersByType } from "@/server-actions/posts";
import { message, Tabs } from "antd";
import React from "react";
import PostItem from "../../_components/PostItem";
import useUsersStore, { UsersStoreType } from "@/store/users";

const UserRelatedPosts = ({ user }: { user: UserType }) => {
  const { loggedInUserData }: UsersStoreType = useUsersStore();
  let canViewPosts = false;
  if (loggedInUserData?._id === user._id) {
    canViewPosts = true;
  }
  if (!user.isPrivateAccount) {
    canViewPosts = true;
  }
  if (user.followers.includes(loggedInUserData?._id!)) {
    canViewPosts = true;
  }
  if (!canViewPosts) {
    return (
      <div className="text-center mt-10 text-xs">
        <span className="text-red-500">
          The Account is private,please follow to see their posts
        </span>
      </div>
    );
  }

  const [activeTab, setActiveTab] = React.useState("1");
  const [data, setData] = React.useState<any>({
    uploaded: [],
    tagged: [],
    liked: [],
    saved: [],
    archived: [],
  });
  const [loading, setLoading] = React.useState(false);
  const tabsAndvalues: any = {
    1: "Uploaded",
    2: "Tagged",
    3: "Saved",
    4: "Archived",
    5: "Liked",
  };
  const getData = async () => {
    try {
      setLoading(true);
      const response = await getPostsOfUsersByType({
        userId: user._id,
        type: tabsAndvalues[Number(activeTab)].toLowerCase(),
      });
      if (response?.success) {
        const newData: any = { ...data };
        const tabName = tabsAndvalues[Number(activeTab)].toLowerCase();
        newData[tabName] = response.data;
        setData(newData);
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    getData();
  }, [activeTab]);

  const renderPostsOfSelectedTab = () => {
    const tabName = tabsAndvalues[Number(activeTab)].toLowerCase();
    const dataOfTab: any[] = data[tabName];
    if (dataOfTab.length === 0) {
      return <div className="text-center tect-gray-500">No Posts Found</div>;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {dataOfTab.map((post: any) => {
          return (
            <PostItem
              key={post._id}
              post={post}
              type="uploaded"
              reloadData={getData}
            />
          );
        })}{" "}
      </div>
    );
  };
  return (
    <div className="mt-8">
      <Tabs
        activeKey={activeTab}
        type="card"
        onChange={(key) => setActiveTab(key)}
      >
        <Tabs.TabPane tab="Uploaded" key="1">
          {" "}
          {renderPostsOfSelectedTab()}
        </Tabs.TabPane>

        <Tabs.TabPane tab="Tagged" key="2">
          {renderPostsOfSelectedTab()}
        </Tabs.TabPane>

        <Tabs.TabPane tab="Saved" key="3">
          {renderPostsOfSelectedTab()}
        </Tabs.TabPane>

        {loggedInUserData?._id === user._id && (
          <Tabs.TabPane tab="Archived" key="4">
            {renderPostsOfSelectedTab()}
          </Tabs.TabPane>
        )}
      </Tabs>
    </div>
  );
};

export default UserRelatedPosts;
