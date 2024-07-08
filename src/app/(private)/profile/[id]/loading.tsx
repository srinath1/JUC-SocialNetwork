import Spinner from "@/components/Spinner";
import React from "react";

const Loading = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Spinner />
    </div>
  );
};

export default Loading;
