"use client"
import ProgressBar from "./components/progressBar";

import { useRef, useState } from "react";

export default function Home() {
  const [progressVideo, setProgress] = useState<number>(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const handlePause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };


  const handleProgressTime = () => {
    const video = videoRef.current
    if (!video) return
    setProgress((video.currentTime / video.duration) * 100)
  }

  const durationVideo = () => {
    const video = videoRef.current
    if (!video) return 
    return video.duration
  }

  return (
    <main className="items-center justify-center flex flex-col h-screen w-full">
        <div className="items-center justify-center flex">
            <div id="player" onClick={handlePause} className="relative z-10 bg-[#202020] rounded-xl h-[664px] w-[1180px] flex items-center justify-center">
              <video
                src="/videos/video.mp4"
                className="h-full w-auto object-cover rounded-xl"
                ref={videoRef}
                onTimeUpdate={handleProgressTime}
                autoPlay
              />
              
              <ProgressBar duration={durationVideo() ?? 0} progress={progressVideo}/>
            </div>
        </div>
    </main>
  );
}
