import { useEffect, useRef, useState } from "react"

interface props {
    progress: number,
    duration: number,
    newPosition: (position:number) => void
}

export default function ProgressBar({progress, duration, newPosition}: props){
    const [isDragging, setIsDraging] = useState(false)
    const [position, setPosition] = useState({x:0})
    const drgaRef = useRef<HTMLDivElement>(null)
    const initialMousePos = useRef({x:0})
    const startEndBar = useRef<HTMLDivElement>(null)
    const [durationFormated, setDurationFormated] = useState('')
    const [progressFormated, setProgressFormated] = useState('')

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if(startEndBar.current) {
            const barProgress = startEndBar.current.getBoundingClientRect()
            let axyX = e.clientX - barProgress.left
            const newX = Math.max(0, Math.min(axyX, barProgress.width))

            const newProgress = (newX / barProgress.width) * 100;
            newPosition(newProgress);
        }
        setIsDraging(true)
        initialMousePos.current = {x: e.clientX}
    }

    const handleMouseMove = (e:MouseEvent) => {
        if(!isDragging) return
        e.preventDefault()
        if(startEndBar.current) {
            const barProgress = startEndBar.current.getBoundingClientRect()
            let axyX = e.clientX - barProgress.left
            const newX = Math.max(0, Math.min(axyX, barProgress.width))

            const newProgress = (newX / barProgress.width) * 100;
            newPosition(newProgress);
        }
    }

    const handleMouseUp = () => {
        setIsDraging(false)
    }

    const calcTimeFormated = (time:number) => {
        const hour = Math.floor(time / 3600)
        const minutes = Math.floor((time % 3600) / 60)
        const seconds = time % 60

        const hourFormated = String(hour).padStart(2, '0')
        const minutesFormated = String(minutes).padStart(2, '0')
        const secondsFormated = String(seconds).padStart(2, '0')

        return `${hour ? hourFormated + ':' : ''}${minutesFormated}:${secondsFormated}`
    }

    useEffect(() => {
        setDurationFormated(calcTimeFormated(duration))
    }, [duration])

    useEffect(() => {
        const secondsProgress = Math.floor((progress * duration) / 100)
        setProgressFormated(calcTimeFormated(secondsProgress))
    }, [progress])

    useEffect(() => {
        if(isDragging) {
            document.addEventListener("mouseup", handleMouseUp)
            document.addEventListener("mousemove", handleMouseMove)
        }
        return () => {
            document.removeEventListener("mouseup", handleMouseUp)
            document.removeEventListener("mousemove", handleMouseMove)
        }
    }, [isDragging, handleMouseMove, handleMouseUp])

    return (
    <div className="flex flex-col justify-center items-start">
        <div onMouseDown={handleMouseDown} ref={startEndBar} id="full-bar" className="select-none z-20 backdrop-blur-2xl relative rounded-full h-[4px] w-full bg-[#ffffff71] flex items-center">
            <div
             style={{width:`${progress}%`, userSelect: 'none'}}
             id="bar-progress" className={`transition-all duration-100 ease-linear rounded-full z-20 h-[4px] bg-[#00c3ff]`}></div>
            <div
             id="point-bar"
             ref={drgaRef}
             style={{left: `${progress}%`, userSelect: 'none', position: 'absolute', transform: isDragging ? `translateX(${position.x}px)` : 'none'}}
             className={`z-20 transition-all duration-100 ease-linear rounded-full w-[14px] h-[14px] bg-[#00c3ff]`}></div>
        </div>
        <p className="mt-3 text-[14px] font-bold">{progressFormated} / {durationFormated}</p>
    </div>
)
}
