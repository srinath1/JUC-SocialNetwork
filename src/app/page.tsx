import Timeline from "./(private)/_components/Timeline";
import TimeLineHeader from "./(private)/_components/TimeLineHeader";

export default async function Home() {
  return (
    <div className="grid lg:grid-cols-4 mb-5">
      <div className="col-span-2">
        <TimeLineHeader />
        <Timeline />
      </div>
    </div>
  );
}
