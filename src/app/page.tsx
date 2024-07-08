import Timeline from "./(private)/_components/Timeline";
import TimeLineHeader from "./(private)/_components/TimeLineHeader";
import { Suspense } from "react";

export default async function Home() {
  return (
    <div className="grid lg:grid-cols-4 mb-5">
      <div className="col-span-2">
        <Suspense fallback={<>Loading...</>}>
          <TimeLineHeader />
          <Timeline />
        </Suspense>
      </div>
    </div>
  );
}
