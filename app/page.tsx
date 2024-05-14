import { Suspense } from "react";
import { Map } from "./components/Map";

export default function Home() {
  return (
    <Suspense fallback={<p className="font-semibold size-40 ">Loading...</p>}>
      <Map />
    </Suspense>
  );
}
