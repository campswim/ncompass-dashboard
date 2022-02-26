import React, { useState, useEffect } from 'react';
import Api from './api-call';

const Dropdown = props => {
  const arrayOfDays = [...Array(96).keys()];
  const [size, setSize] = useState(1);
  
  const handleMouseDown = () => setSize(10);
  const handleClick = () => {
    setSize(1);
  }

  const clickSniffer = event => {
    const selectElement = '[object HTMLSelectElement]';
    const optionElement = '[object HTMLOptionElement]';
    const target = event.target.toString();
    if (target && !target.includes(selectElement) && !target.includes(optionElement)) {
      setSize(1);
    }
    return () => {
      // Unbind the event listener on clean up.
      document.removeEventListener("mousedown", clickSniffer);
    };
  }

  useEffect(() => {
    // Bind the event listener.
    document.addEventListener("mousedown", clickSniffer);
  });

  return (
    <div className='dash-pushed-tableset'>
      <div className='dropdown'>
        <form className='select-form'>
          <select
            className={props.path}
            onChange={event => props.handleChange(event)}
            value={props.days}
            onMouseDown={event => handleMouseDown(event)}
            size={size}
          >
            {arrayOfDays.map(day => (
              <option key={day} value={day} onClick={handleClick}>
                {day === 0
                  ? 'Today'
                  : day === 1
                  ? 'Yesterday'
                  : `Past ${day + 1} days`}
              </option>
            ))}
          </select>
        </form>
      </div>
      <Api path={props.path} />
    </div>
  );
};

export default Dropdown;
