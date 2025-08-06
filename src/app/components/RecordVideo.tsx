"use client"
import ProgressBar from "@/app/components/progressBar";
import PlayPause from "@/app/components/playPause"

import { useEffect, useRef, useState } from "react";

interface props {
  setUrlVideo: (url:string) => void
}

export default function RecordVideo({setUrlVideo}: props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recorderChunksRef = useRef<Blob[]>([])
  const [isRecording, setIsRecording] = useState(false)

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

        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(recorderChunksRef.current, {
            type: "video/webm; codecs=vp8;"
          })
          const url = URL.createObjectURL(blob)
          setUrlVideo(url)
          recorderChunksRef.current = []
        }
      } catch (error) {
        console.log(error)
        setPermissionGranted(false)
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

  const startRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "inactive") {
      recorderChunksRef.current = []
      mediaRecorderRef.current.start()
      setIsRecording(true)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state == "recording") {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  return (
    <main className="items-center justify-center flex flex-col h-screen w-full">
        <div id="player"className={`w-[80%] transition-all duration-100 ease-linear relative z-10 bg-[#202020] rounded-xl h-fit flex items-center justify-center`}>
          <video
            autoPlay
            playsInline
            style={{display: permissionGranted ? "block":"none"}}
            className={`w-full object-cover rounded-xl`}
            ref={videoRef}
          />
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

                {isRecording ? (
            <button
              onClick={stopRecording}
              disabled={!isRecording}
              className="mt-2 flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-full shadow transition duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 fill-current"
                viewBox="0 0 24 24"
              >
                <rect x="8" y="8" width="8" height="8" />
              </svg>
              Parar Gravação
            </button>
          ) : (
            <button
              onClick={startRecording}
              disabled={isRecording}
              className=" mt-2 flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-full shadow transition duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 fill-current"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="8" />
              </svg>
              Iniciar Gravação
            </button>
          )}
    </main>
  );
}
