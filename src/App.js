import React, { useState, useEffect } from "react";
import ding from "./ding.ogg";

function App() {
  const [sessionLength, setSessionLength] = useState(25);
  const sessionLengthLeft = useState(sessionLength * 60);
  const [breakTime, setBreakTime] = useState(5);
  const breakTimeLeft = useState(breakTime * 60);
  const [timerStatus, setTimerStatus] = useState(false);
  const [breakStatus, setBreakStatus] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    if (breakStatus) {
      return addInterval(breakTimeLeft, timerStatus);
    } else {
      return addInterval(sessionLengthLeft, timerStatus);
    }
  }, [breakStatus, timerStatus]);

  const addInterval = (time, status) => {
    const intervalId = setInterval(() => {
      return status && time[1]((s) => s - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  };

  const audioRef = React.useRef(document.querySelector("#ding"));

  useEffect(() => {
    if (breakStatus && breakTimeLeft[0] === 0) {
      sessionLengthLeft[1](sessionLength * 60);
      setBreakStatus(false);
    } else if (!breakStatus && sessionLengthLeft[0] === 0) {
      breakTimeLeft[1](breakTime * 60);
      setBreakStatus(true);
      // audioRef.current.play();
    }
  }, [breakStatus, breakTimeLeft, sessionLengthLeft]);

  useEffect(() => {
    sessionLengthLeft[1](sessionLength * 60);
  }, [sessionLength]);

  useEffect(() => {
    breakTimeLeft[1](breakTime * 60);
  }, [breakTime]);

  useEffect(() => breakStatus && setSessionCount((s) => s + 1), [breakStatus]);

  const reset = () => {
    setSessionLength(25);
    setBreakTime(5);
    sessionLengthLeft[1](sessionLength * 60);
    breakTimeLeft[1](breakTime * 60);
    setTimerStatus(false);
    setBreakStatus(false);
    setSessionCount(0);
    resetAudio(audioRef);
  };

  const skip = () => {
    if (breakStatus) {
      resetAudio(audioRef);
      return breakTimeLeft[1](0);
    }
    return sessionLengthLeft[1](0);
  };

  const resetAudio = (ref) => {
    ref.current.pause();
    ref.current.currentTime = 0;
  };

  const convertTime = (num) => {
    const minutes = Math.floor(num / 60);
    const seconds = num % 60;
    return formatTime(minutes + ":" + seconds);
  };

  const formatTime = (time) => {
    const str = time.toString();
    return str.length >= 3
      ? str.replace(/^\d{1}:/g, "0$&").replace(/(?<=:)\d{1}$/, "0$&")
      : str.replace(/^\d$/, "0$&");
  };

  return (
    <div className="flex flex-col items-center text-3xl md:text-2xl bg-gray-50 h-screen text-gray-900 font-normal text-shadow-sm select-none">
      <div
        className={
          (breakStatus
            ? "bg-indigo-200"
            : timerStatus
            ? "bg-red-400"
            : "bg-gray-400") +
          " sm:my-3 md:mt-8 md:mb-auto w-full h-full md:w-auto md:h-3/6 md:flex md:flex-col grid grid-rows-5 grid-cols-1 items-start md:items-center justify-center md:justify-between border-2 bg-opacity-50 p-5 md:p-8 rounded-3xl shadow-md"
        }
      >
        <div className="row-span-1">
          <div
            className="m-2 flex flex-row items-center justify-between w-full"
            id="session-label"
          >
            <p className="font-serif text-gray-600">Session length:&nbsp;</p>
            <div className="flex flex-row items-center">
              <div id="session-decrement">
                <button
                  className="flex justify-center items-center mx-1 transform active:scale-95 bg-gray-100 hover:bg-white p-2 w-10 h-10 md:w-5 md:h-5 rounded-full text-lg font-thin shadow-md"
                  onClick={() =>
                    sessionLength > 5 && setSessionLength((s) => s - 1)
                  }
                >
                  -
                </button>
              </div>
              <div id="session-length">{convertTime(sessionLength * 60)}</div>
              <div id="session-increment">
                <button
                  className="flex justify-center items-center mx-1 transform active:scale-95 bg-gray-100 hover:bg-white p-2 w-10 h-10 md:w-5 md:h-5 rounded-full text-lg font-thin shadow-md"
                  onClick={() => {
                    sessionLength < 180 && setSessionLength((s) => s + 1);
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div
            className="m-2 flex flex-row justify-between w-full"
            id="break-label"
          >
            <p className="font-serif text-gray-600">Break time:&nbsp;</p>
            <div className="flex flex-row items-center">
              <div id="break-decrement">
                <button
                  className="flex justify-center items-center mx-1 transform active:scale-95 bg-gray-100 hover:bg-white p-2 w-10 h-10 md:w-5 md:h-5 rounded-full text-lg  font-thin shadow-md"
                  onClick={() => breakTime > 0 && setBreakTime((s) => s - 1)}
                >
                  -
                </button>
              </div>
              <div id="break-length">{convertTime(breakTime * 60)}</div>
              <div id="break-increment">
                <button
                  className="flex justify-center items-center mx-1 transform active:scale-95 bg-gray-100 hover:bg-white p-2 w-10 h-10 md:w-5 md:h-5 rounded-full text-lg  font-thin shadow-md"
                  onClick={() => breakTime < 60 && setBreakTime((s) => s + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="m-2 self-center justify-self-center row-span-2"
          id="timer-label"
        >
          <div
            className="flex flex-col items-center justify-center text-4xl md:text-3xl"
            id="timer-left"
          >
            {breakStatus ? (
              <>
                <p className="my-3 md:my-2 font-serif text-gray-600">
                  Break time!!
                </p>
                <p className="my-3 md:my-2 text-6xl">
                  {convertTime(breakTimeLeft[0])}
                </p>
              </>
            ) : (
              <>
                <p className="my-3 md:my-2 font-serif text-gray-600">
                  Current session
                </p>
                <p className="my-3 md:my-2 text-6xl">
                  {convertTime(sessionLengthLeft[0])}
                </p>
              </>
            )}
          </div>
        </div>
        <div className="self-end md:self-center row-span-2">
          <div className="m-2 flex justify-center" id="session-count">
            {sessionCount > 0 && "Sessions: " + sessionCount}
          </div>
          <div className="flex flex-row flex-wrap justify-center items-center content-end p-12">
            <div id="start-stop">
              <button
                className="m-3 py-4 px-8 md:py-2 md:px-4 transform active:translate-y-0.5 rounded bg-gray-100 hover:bg-white shadow-md uppercase font-thin text-gray-900"
                onClick={() => setTimerStatus((s) => !s)}
              >
                {(sessionLengthLeft[0] !== sessionLength * 60 ||
                  breakTimeLeft[0] !== breakTime * 60) &&
                !timerStatus
                  ? "Continue"
                  : timerStatus
                  ? "Pause"
                  : "Start"}
              </button>
            </div>
            <div id="reset">
              <button
                className="m-3 py-4 px-8 md:py-2 md:px-4 transform active:translate-y-0.5 rounded bg-gray-100 hover:bg-white shadow-md uppercase font-thin text-gray-900"
                onClick={reset}
              >
                Reset
              </button>
            </div>
            <div id="skip">
              <button
                className="m-3 py-4 px-8 md:py-2 md:px-4 transform active:translate-y-0.5 rounded bg-gray-100 hover:bg-white shadow-md uppercase font-thin text-gray-900"
                onClick={skip}
              >
                Skip
              </button>
            </div>
          </div>
        </div>
        <audio ref={audioRef} src={ding} id="ding" />
      </div>
    </div>
  );
}

export default App;
