import React, { useState } from 'react';
import ApiCall from './api-call';

const Settings = props => {
  const [path, setPath] = useState('config/maps');

  const handleSubmit = event => event.preventDefault();

  // Click handler: which tab to show, maps or params.
  const handleClick = event => {
    event.preventDefault();
    setPath(event.target.value);
    const chosenButton = event.target.id;
    let activeButton, inactiveButton;
    if (chosenButton) {
      activeButton = document.getElementById(chosenButton);
      activeButton.setAttribute('class', 'active-button');
      if (chosenButton === 'map') 
        inactiveButton = document.getElementById('params');
      else inactiveButton = document.getElementById('map');
      inactiveButton.setAttribute('class', 'inactive-button');
    }
  };

  return (
    <>
    <div className='order-actions'>
      <form onSubmit={handleSubmit}>
        <button className='active-button' id='map' value='config/maps' onClick={handleClick}>
          Warehouse Map
        </button>
      </form>
      <form onSubmit={handleSubmit}>
        <button id='params' value='config/params' onClick={handleClick}>
          Parameters
        </button>
      </form>
    </div>
    <ApiCall path={path} />
    </>
  );
};

export default Settings;
