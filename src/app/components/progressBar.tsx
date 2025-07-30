interface props {
    progress: number,
    duration: number
}

export default function ProgressBar({progress, duration}: props){
    return (
    <div className="z-20 bottom-[10px] w-[96%] absolute flex flex-col justify-center items-start">
        <div className="backdrop-blur-2xl rounded-full h-[4px] w-full bg-[#ffffff25] flex items-center">
            <div
             style={{width:`${progress}%`}}
             id="bar-progress" className={`transition-all duration-100 ease-linear rounded-full z-20 h-[4px] bg-[#006eff]`}></div>
        </div>
        <p className="mt-2 font-medium">{Math.floor((progress * duration) / 100) } / {duration}</p>
    </div>
)
}
