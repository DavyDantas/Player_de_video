"use client"
import ProgressBar from "./components/progressBar";
import PlayPause from "@/app/components/playPause"

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [progressVideo, setProgress] = useState<number>(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [widthVideo, setWidthVideo] = useState(50)
  const [playedVideo, setPlayedVideo] = useState(true)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recorderChunksRef = useRef<Blob[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [videoURL, setVideoURL] = useState<string | null>(null)

  useEffect(() => {
    async function getCameraFeed() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        })
        setStream(stream)
        setPermissionGranted(true)
        mediaRecorderRef.current = new MediaRecorder(stream, {
          mimeType: "video/webm; codecs=vp8"
        })
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recorderChunksRef.current.push(event.data)
          }
        }
      } catch (error) {
        console.log(error)
        setPermissionGranted(false)
      }
    }

    const startRecording = () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "inactive") {
        recorderChunksRef.current = []
        mediaRecorderRef.current.start()
        setIsRecording(true)
        setVideoURL(null)
      }
    }

    getCameraFeed()
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
        setStream(null)
        setPermissionGranted(false)
      }
    }
  }, [])

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

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
        <div style={{width: `${widthVideo}%`}}  className="transition-all duration-100 ease-linear relative z-10 bg-[#202020] rounded-xl flex items-center justify-center">
            <div id="player" onClick={handlePause} className={`transition-all duration-100 ease-linear relative z-10 bg-[#202020] rounded-xl h-fit flex items-center justify-center`}>
              <PlayPause play={playedVideo}/>
              <video
                autoPlay
                playsInline
                style={{display: permissionGranted ? "block":"none"}}
                className={`h-auto w-full object-cover ${widthVideo === 50 ? 'rounded-xl':''}`}
                ref={videoRef}
                onTimeUpdate={handleProgressTime}
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
      {!permissionGranted && (
       <div
         style={{maxWidth: "600px",width: "100%",backgroundColor: "black",
           color: "white",padding: "10px",textAlign: "center",height: "450px",
           display: "flex",alignItems: "center",justifyContent: "center"}}
       >
         <p>Erro ao carregar o vídeo</p>
       </div>
      )}
    </main>
  );
}
