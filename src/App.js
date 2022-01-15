import React, { useState, useEffect } from 'react';
import Controls from './Controls';
import ding from './ding.ogg';

function App() {
  const [sessionLength, setSessionLength] = useState(25);
  const [sessionLengthLeft, setSessionLengthLeft] = useState(
    sessionLength * 60
  );
  const [breakTime, setBreakTime] = useState(5);
  const [breakTimeLeft, setBreakTimeLeft] = useState(breakTime * 60);
  const [timerStatus, setTimerStatus] = useState(false);
  const [breakStatus, setBreakStatus] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [timerStatusText, setTimerStatusText] = useState('Start');
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (breakStatus) {
      return addInterval(setBreakTimeLeft, timerStatus);
    } else {
      return addInterval(setSessionLengthLeft, timerStatus);
    }
  }, [breakStatus, timerStatus]);

  useEffect(() => {
    (sessionLengthLeft !== sessionLength * 60 ||
      breakTimeLeft !== breakTime * 60) &&
    !timerStatus
      ? setTimerStatusText('Continue')
      : timerStatus
      ? setTimerStatusText('Pause')
      : setTimerStatusText('Start');
  }, [breakTime, breakTimeLeft, sessionLength, sessionLengthLeft, timerStatus]);

  const addInterval = (setTime, status) => {
    const intervalId = setInterval(() => {
      return status && setTime((s) => s - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  };

  const audioRef = React.useRef(document.querySelector('#ding'));

  useEffect(() => {
    if (breakStatus && breakTimeLeft === 0) {
      setSessionLengthLeft(sessionLength * 60);
      setBreakStatus(false);
    } else if (!breakStatus && sessionLengthLeft === 0) {
      setBreakTimeLeft(breakTime * 60);
      setBreakStatus(true);
      audioRef.current.volume = 0.4;
      audioRef.current.play();
    }
  }, [breakStatus, breakTime, breakTimeLeft, sessionLength, sessionLengthLeft]);

  useEffect(() => {
    setSessionLengthLeft(sessionLength * 60);
  }, [sessionLength]);

  useEffect(() => {
    setBreakTimeLeft(breakTime * 60);
  }, [breakTime]);

  useEffect(() => breakStatus && setSessionCount((s) => s + 1), [breakStatus]);

  useEffect(() => {
    const timeoutId = setTimeout(() => errorText && setErrorText(''), 2000);
    return () => clearTimeout(timeoutId);
  }, [errorText]);

  const reset = () => {
    setSessionLength(25);
    setBreakTime(5);
    setSessionLengthLeft(sessionLength * 60);
    setBreakTimeLeft(breakTime * 60);
    setTimerStatus(false);
    setBreakStatus(false);
    setSessionCount(0);
    resetAudio(audioRef);
  };

  const skip = () => {
    if (breakStatus) {
      resetAudio(audioRef);
      return setBreakTimeLeft(0);
    }
    return setSessionLengthLeft(0);
  };

  const resetAudio = (ref) => {
    ref.current.pause();
    ref.current.currentTime = 0;
  };

  const convertTime = (num, str) => {
    const minutes = Math.floor(num / 60);
    const seconds = num % 60;
    return str === 'min'
      ? formatTime(minutes)
      : formatTime(minutes + ':' + seconds);
  };

  const formatTime = (time) => {
    const str = time.toString();
    return str.length >= 3
      ? str.replace(/^\d{1}:/g, '0$&').replace(/(?<=:)\d{1}$/, '0$&')
      : str.replace(/^\d$/, '0$&');
  };

  return (
    <div className='flex flex-col h-screen items-center text-3xl md:text-2xl bg-gray-50 text-gray-900 font-normal text-shadow-sm select-none'>
      <div
        className={
          (breakStatus
            ? 'bg-indigo-200'
            : timerStatus
            ? 'bg-red-400'
            : 'bg-gray-400') +
          ' sm:my-3 md:mt-8 w-full h-full md:max-w-xl md:h-min md:flex md:flex-col grid grid-rows-5 grid-cols-1 items-start md:items-center justify-center md:justify-between border-2 bg-opacity-50 p-5 md:p-8 rounded-3xl shadow-md'
        }
      >
        <div className='row-span-1 w-full md:max-w-md'>
          <Controls
            text='Session length'
            length={sessionLength}
            setLength={setSessionLength}
            convert={convertTime}
            setError={setErrorText}
          />
          <Controls
            text='Break time'
            length={breakTime}
            setLength={setBreakTime}
            convert={convertTime}
            setError={setErrorText}
          />
        </div>
        <div
          className='p-4 m-2 self-center justify-self-center row-span-2'
          id='timer-label'
        >
          <div
            className='flex flex-col items-center justify-center text-4xl md:text-3xl'
            id='timer-left'
          >
            {breakStatus ? (
              <>
                <p className='my-3 md:my-2 font-serif text-gray-600'>
                  Break time!!
                </p>
                <p className='my-3 md:my-2 text-6xl'>
                  {convertTime(breakTimeLeft)}
                </p>
              </>
            ) : (
              <>
                <p className='my-3 md:my-2 font-serif text-gray-600'>
                  Current session
                </p>
                <p className='my-3 md:my-2 text-6xl'>
                  {convertTime(sessionLengthLeft)}
                </p>
              </>
            )}
          </div>
        </div>
        <div className='self-end md:self-center row-span-2'>
          <div className='flex justify-center' id='session-count'>
            {sessionCount > 0 && 'Sessions: ' + sessionCount}
          </div>
          <div className='flex flex-row flex-wrap justify-center items-center content-end p-6'>
            <div id='start-stop'>
              <button
                className='m-3 py-4 px-8 md:py-2 md:px-4 rounded bg-gray-100 hover:bg-white shadow-md uppercase font-thin text-gray-900'
                onClick={() => setTimerStatus((s) => !s)}
              >
                {timerStatusText}
              </button>
            </div>
            <div id='reset'>
              <button
                className='m-3 py-4 px-8 md:py-2 md:px-4 rounded bg-gray-100 hover:bg-white shadow-md uppercase font-thin text-gray-900'
                onClick={reset}
              >
                Reset
              </button>
            </div>
            <div id='skip'>
              <button
                className='m-3 py-4 px-8 md:py-2 md:px-4 rounded bg-gray-100 hover:bg-white shadow-md uppercase font-thin text-gray-900'
                onClick={skip}
              >
                Skip
              </button>
            </div>
          </div>
        </div>
        <div className='text-sm font-mono flex justify-center' id='error'>
          {errorText}
        </div>
      </div>
      <audio ref={audioRef} src={ding} id='ding' />
    </div>
  );
}

export default App;
