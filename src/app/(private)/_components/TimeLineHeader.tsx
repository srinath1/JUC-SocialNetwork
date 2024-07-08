"use client";
import useUsersStore, { UsersStoreType } from "@/store/users";
import { Button } from "antd";
import React from "react";
import UploadPostModal from "./UploadPostModal";

const TimeLineHeader = () => {
  const { loggedInUserData }: UsersStoreType = useUsersStore();
  const [showNewPostModal, setShowNewPostModal] = React.useState(false);

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-xl text-gray-500">
        Here is your feed!{" "}
        <b className="text-primary">{loggedInUserData?.name.toUpperCase()}</b>
      </h1>
      <Button
        type="primary"
        onClick={() => setShowNewPostModal(true)}
        size="small"
        className="h-8"
      >
        Upload Post
      </Button>
      {showNewPostModal && (
        <UploadPostModal
          setShowNewPostModal={setShowNewPostModal}
          showNewPostModal={showNewPostModal}
          user={loggedInUserData!}
        />
      )}
    </div>
  );
};

export default TimeLineHeader;
