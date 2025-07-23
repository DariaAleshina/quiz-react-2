import { useEffect } from "react"

function Timer({ dispatch, secondsRemaining }) {
    // const minutes = (secondsRemaining / 60);
    // const seconds = secondsRemaining - minutes * 60;
    useEffect(() => {
        const id = setInterval(() => {
            dispatch({ type: 'tick' })
        }, 1000);
        return () => clearInterval(id);
    }, [dispatch]);

    return (
        <div div className="timer" >
            {secondsRemaining}
        </div >)
}

export default Timer
