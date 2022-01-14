import React, { useState, useEffect, useRef } from 'react';

function Controls({ text, length, setLength, convert, setError }) {
  const inputRef = useRef(null);
  const [showInput, setShowInput] = useState(false);
  const type = text.split(' ')[0].toLowerCase();
  const minValue = type === 'break' ? 2 : type === 'session' && 5;
  const maxValue = type === 'break' ? 30 : type === 'session' && 180;
  const secondsInMinute = 60;
  useEffect(() => {
    const item = +localStorage.getItem(type);
    item && setLength(item);
  }, []);
  const errorTextMin = 'Value is at its minimum';
  const errorTextMax = 'Value is at its maximum';
  useEffect(() => {
    localStorage.setItem(type, length);
  }, [length, type]);
  const handleLength = (v) =>
    v >= minValue && v <= maxValue
      ? setLength(v)
      : v < minValue
      ? setError(errorTextMin)
      : v > maxValue && setError(errorTextMax);
  return (
    <div
      className='m-2 flex flex-row justify-between w-full'
      id={`${type}-label`}
    >
      <p className='font-serif text-gray-600'>{text}:&nbsp;</p>
      <div className='flex flex-row items-center'>
        <div id='session-decrement'>
          <button
            className='flex justify-center items-center mx-1 bg-gray-100 hover:bg-white p-2 w-10 h-10 md:w-5 md:h-5 rounded-full text-lg font-thin shadow-md'
            onClick={() =>
              length > minValue
                ? setLength((s) => s - 1)
                : setError(errorTextMin)
            }
          >
            -
          </button>
        </div>
        <div className='font-mono' id='session-length'>
          {convert(length * secondsInMinute, 'min')}
        </div>
        <div id='session-increment'>
          <button
            className='flex justify-center items-center mx-1 bg-gray-100 hover:bg-white p-2 w-10 h-10 md:w-5 md:h-5 rounded-full text-lg font-thin shadow-md'
            onClick={() => {
              length < maxValue
                ? setLength((s) => s + 1)
                : setError(errorTextMax);
            }}
          >
            +
          </button>
        </div>
        <div
          className='flex row items-center children:mx-1 children:rounded-md'
          id='session-set'
        >
          <button
            className='flex justify-center items-center bg-gray-100 hover:bg-white p-2 w-20 h-10 md:w-min md:h-5 text-lg font-thin shadow-md'
            onClick={(e) => {
              setShowInput((s) => !s);
              const t = e.target.innerText;
              const v = +inputRef.current.value;
              if (t === 'Confirm') handleLength(v);
              else setTimeout(() => inputRef.current.focus(), 1);
            }}
          >
            {showInput ? 'Confirm' : 'Set'}
          </button>
          <div className={(!showInput && 'hidden') + ' flex row'}>
            <input
              ref={inputRef}
              type='text'
              className='bg-gray-100 w-12 rounded-md text-center'
              onBlur={(e) =>
                setTimeout(() => {
                  setShowInput(false);
                  e.target.value = '';
                }, 100)
              }
              onKeyDown={(e) => {
                const v = +e.target.value;
                if (e.key === 'Enter') {
                  handleLength(v);
                  e.target.blur();
                }
              }}
            />
            <p className='text-sm self-end mx-1'>minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Controls;
