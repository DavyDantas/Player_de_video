"use client"
import ProgressBar from "@/app/components/progressBar";
import PlayPause from "@/app/components/playPause"

import { useEffect, useRef, useState } from "react";

export default function VideoPLayer({url}:{url:string}) {
  const [progressVideo, setProgress] = useState<number>(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [widthVideo, setWidthVideo] = useState(50)
  const [playedVideo, setPlayedVideo] = useState(true)
  const [videoReady, setVideoReady] = useState(false)



  const handlePause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlayedVideo(false)
    } else {
      video.pause();
      setPlayedVideo(true)
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
  }



  return (
    <main className="items-center justify-center flex flex-col h-screen w-full">
        <h3>Vídeo gravado:</h3>
          <div style={{width: `${widthVideo}%`}} className="transition-all duration-100 ease-linear relative bg-[#202020] rounded-xl flex items-center justify-center">
              <div id="player" onClick={handlePause} className={`relative w-full flex items-center justify-center`}>
                <PlayPause play={playedVideo}/>
                <video
                  onLoadedMetadata={() => setVideoReady(true)}
                  preload="metadata"
                  playsInline
                  className={`h-full object-cover ${widthVideo === 50 ? 'rounded-xl':''}`}
                  ref={videoRef}
                  src={url}
                  onTimeUpdate={handleProgressTime}
                />
              </div>

              <div className="z-20 bottom-[14px] w-[96%] absolute ">
                <button
                  className="p-2 cursor-pointer absolute right-[-8px] top-[8px]"
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

        {url && (
            <div className="mt-4">
              <a className="text-blue-500 font-bold" href={url} download="video.webm">
                Baixar vídeo
              </a>
            </div>
          )}
    </main>
  );
}
