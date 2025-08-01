import { CiPlay1, CiPause1 } from "react-icons/ci";

export default function PlayPause({play}:{play:boolean}) {
    return(
        <div className="rounded-full flex top-1/2 left-1/2 justify-center items-center absolute w-[100px] h-[100px] bg-[#000000c7] transform -translate-x-1/2 -translate-y-1/2">
            {play ? 
             (<CiPlay1 size={50}/>) :
             (<CiPause1 size={50} /> )
        }
        </div>
    )
}