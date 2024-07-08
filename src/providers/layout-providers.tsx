"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import { usePathname } from "next/navigation";
import path from "path";
import { message } from "antd";
import { getCurrentUserFromMongoDB } from "@/server-actions/users";
import { useUsersStore, UsersStoreType } from "@/store/users";
import Spinner from "@/components/Spinner";

function LayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.includes("sign-in") || pathname.includes("sign-up")) {
    return <>{children}</>;
  }
  const { setLoggedInUserData, loggedInUserData }: UsersStoreType =
    useUsersStore();
  const [loading, setLoading] = useState<boolean>(false);
  const getCurrentUserData = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUserFromMongoDB();
      if (response.success) {
        setLoggedInUserData(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getCurrentUserData();
  }, []);
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="flex lg:flex-row flex-col gap-3 h-screen">
      <Sidebar />
      <div className="py-10 flex-1 px-10 overflow-y-scroll">
        {children}
      </div>{" "}
    </div>
  );
}

export default LayoutProvider;
