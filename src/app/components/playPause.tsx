import { CiPlay1, CiPause1 } from "react-icons/ci";
import { useTransition, animated } from '@react-spring/web'

export default function PlayPause({play}:{play:boolean}) {
    const transitions = useTransition(play, {
        from: { opacity: 0, transform: 'scale(0.8)' },
        enter: { opacity: 1, transform: 'scale(1)' },
        leave: { opacity: 0, transform: 'scale(0.7)' },
        config: { tension: 300, friction: 30, mass: 2 }
    })

    return transitions((style, item) => (
        item && (
            <animated.div style={style} className="rounded-full flex top-1/2 left-1/2 justify-center items-center absolute w-[100px] h-[100px] bg-[#000000c7] transform -translate-x-1/2 -translate-y-1/2">
                {play ?
                    (<CiPause1 size={50} />) :
                    (<CiPlay1 size={50} />)
                }
            </animated.div>
        )
    ))
}