"use client"

import { useState } from "react";
import RecordVideo from "./components/RecordVideo";
import VideoPLayer from "./components/VideoPlayer";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState<string>('')

  const urlVideo = (url:string) => {
    setVideoUrl(url)
  }

  return (
    <main className="items-center justify-center flex flex-col h-screen w-full">
        <div className="flex flex-row w-full h-full">
          <RecordVideo setUrlVideo={urlVideo}/>
          <VideoPLayer url={videoUrl}/>
        </div>
    </main>
  );
}
