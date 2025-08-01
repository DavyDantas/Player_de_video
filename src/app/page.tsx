"use client"
import ProgressBar from "./components/progressBar";
import PlayPause from "@/app/components/playPause"

import { useRef, useState } from "react";

export default function Home() {
  const [progressVideo, setProgress] = useState<number>(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [widthVideo, setWidthVideo] = useState(50)
  const [playedVideo, setPlayedVideo] = useState(false)

  const handlePause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlayedVideo(true)
    } else {
      video.pause();
      setPlayedVideo(false)
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

  const newProgress = (newPos:number) => {
    setProgress(newPos)
    const video = videoRef.current
    if (!video) return
    video.currentTime = (video.duration * newPos) / 100
  }

  const handleToggleWidth = () => {
    setWidthVideo((width) => width === 50 ? 95 : 50);
    console.log(widthVideo)
  }

  return (
    <main className="items-center justify-center flex flex-col h-screen w-full">
        <div style={{width: `${widthVideo}%`}}  className="transition-all duration-100 ease-linear relative z-10 bg-[#202020] rounded-xl flex items-center justify-center">
            <div id="player" onClick={handlePause} className={`transition-all duration-100 ease-linear relative z-10 bg-[#202020] rounded-xl h-fit flex items-center justify-center`}>
              <PlayPause play={playedVideo}/>
              <video
                src="/videos/video.mp4"
                className={`h-auto w-full object-cover ${widthVideo === 50 ? 'rounded-xl':''}`}
                ref={videoRef}
                onTimeUpdate={handleProgressTime}
                autoPlay
              />
            </div>

            <div className="z-20 bottom-[14px] w-[96%] absolute ">
              <button
                className="p-2 cursor-pointer absolute right-[-8px] top-[8px] z-30"
                onClick={handleToggleWidth}
                title="Toggle video width"
                aria-label="Toggle video width"
                >
                <div className="w-[36] h-[26] border-[3px] flex justify-center items-center border-white rounded-[2]">
                  <div className="w-[16] h-[11] border-[3px] border-gray-200"></div>
                </div>
              </button>
              <ProgressBar newPosition={newProgress} duration={durationVideo() ?? 0} progress={progressVideo}/>
            </div>
        </div>
    </main>
  );
}
