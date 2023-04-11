import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Api from './api-call';
import formatDate from '../../components/format-date';

const FailedOrders = () => {
  const params = useLocation();
  let state = null;
  if (params) state = params.state;
  if (state) var { order, postPath, action, id } = state; // This is for user-initiated actions, not the get-all-failed called.

  const [getQuery, setGetQuery] = useState(id === 'unpushed' ? 'failedPushes' : id === 'unpulled' ? 'CrmOrders/Failed' : 'failedPulls');
  const [click, setClick] = useState('');
  const [date, setDate] = useState([
    new Date().getDate(),
    new Date().getMonth(),
    new Date().getFullYear(),
    new Date().getHours(),
    new Date().getMinutes(),
    new Date().getSeconds(),
  ]);
  const [formattedDate, setFormattedDate] = useState({});

  const handleClick = event => {
    event.preventDefault();
    setDate([
      new Date().getDate(),
      new Date().getMonth(),
      new Date().getFullYear(),
      new Date().getHours(),
      new Date().getMinutes(),
      new Date().getSeconds(),
    ]);
    formatDate(date);
    setGetQuery(event.target.value);
    setClick(true);

  const chosenButton = event.target.id;
    let activeButton, inactiveButton;
    if (chosenButton) {
      activeButton = document.getElementById(chosenButton);
      activeButton.setAttribute('class', 'active-button');
      if (chosenButton === 'CrmOrders') inactiveButton = document.getElementById('StagingOrders');
      else inactiveButton = document.getElementById('CrmOrders');
      inactiveButton.setAttribute('class', 'inactive-button');
    }
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setFormattedDate(formatDate(date));
      if (state && (!click || click === '')) {
        if (action === 'Repush')
          setGetQuery('failedPushes'); // Failed pushes.
        else if (action === 'Repull' || action === 'RepullAllowMismatch')
          setGetQuery('failedPulls'); // Failed pulls.
      };
      return () => (mounted = false);
    }
  }, [date, state, click, action]);

  return getQuery ? (
    <>
      <div className='order-actions'>
        <form>
          <button className='active-button' id='CrmOrders' value='CrmOrders/Failed' onClick={handleClick}>
            Failed to Pull
          </button>
        </form>
        <form>
          <button className='inactive-button' id='StagingOrders' value='StagingOrders/Failed' onClick={handleClick}>
            Failed to Push
          </button>
        </form>
        <p>
          as of {formattedDate.day} {formattedDate.month} {formattedDate.year} at{' '}
          {formattedDate.hour}:{formattedDate.minutes}:{formattedDate.seconds}{' '}
          {formattedDate.amOrPm}
        </p>
      </div>
      <Api getQuery={getQuery} postPath={postPath} order={order} action={action} callerId={id}/>
    </>
  ) : (
    ''
  );
};

export default FailedOrders;
