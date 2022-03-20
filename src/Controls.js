import React, { useState, useEffect, useRef } from 'react';

function Controls({ text, length, setLength, convert, setError }) {
  const inputRef = useRef(null);
  const [showInput, setShowInput] = useState(false);
  const type = text.split(' ')[0].toLowerCase();
  useEffect(() => {
    const item = +localStorage.getItem(type);
    item && setLength(item);
  }, []);
  useEffect(() => {
    localStorage.setItem(type, length);
  }, [length, type]);
  const minValue = type === 'break' ? 2 : type === 'session' && 5;
  const maxValue = type === 'break' ? 30 : type === 'session' && 180;
  const secondsInMinute = 60;
  const errorTextMin = 'Value set to it\'s minimum';
  const errorTextMax = 'Value set to it\'s maximum';
  const errorTextEmpty = 'Input field is empty';
  const handleLength = () => {
    const vStr = inputRef.current.value;
    const v = +vStr;
    if (v >= minValue && v <= maxValue) setLength(v);
    else if (!vStr) setError(errorTextEmpty);
    else if (v < minValue) {
      setLength(minValue);
      setError(errorTextMin);
    } else if (v > maxValue) {
      setLength(maxValue);
      setError(errorTextMax);
    }
  };

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
        <div className='flex' id='session-length'>
          <p className='font-mono'>
            {convert(length * secondsInMinute, 'min')}
          </p>
          <p className='text-sm mb-1 self-end'>m</p>
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
                if (e.key === 'Enter') {
                  handleLength();
                  e.target.blur();
                }
              }}
            />
          </div>
          <button
            className='flex justify-center items-center bg-gray-100 hover:bg-white p-2 w-20 h-10 md:w-min md:h-5 text-lg font-thin shadow-md'
            onClick={(e) => {
              setShowInput((s) => !s);
              const t = e.target.innerText;
              if (t === 'Confirm') handleLength();
              else setTimeout(() => inputRef.current.focus(), 1);
            }}
          >
            {showInput ? 'Confirm' : 'Input'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Controls;
