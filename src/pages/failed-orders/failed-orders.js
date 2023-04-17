import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Api from './api-call';
import formatDate from '../../components/format-date';

const FailedOrders = () => {
  const params = useLocation();
  let state = null;
  if (params) state = params.state;
  if (state) var { order, postPath, action, id } = state; // This is for user-initiated actions, not the get-all-failed called.
  
  const [getQuery, setGetQuery] = useState('failedPulls');
  const [click, setClick] = useState(false);
  const [date, setDate] = useState([
    new Date().getDate(),
    new Date().getMonth(),
    new Date().getFullYear(),
    new Date().getHours(),
    new Date().getMinutes(),
    new Date().getSeconds(),
  ]);
  const [formattedDate, setFormattedDate] = useState({});
  const [currentPage, setCurrentPage] = useState('');

  const handleClick = event => {
    event.preventDefault();
    const chosenPage = event.target.value;
    let activeButton, inactiveButton;

    setClick(true);
    setDate([
      new Date().getDate(),
      new Date().getMonth(),
      new Date().getFullYear(),
      new Date().getHours(),
      new Date().getMinutes(),
      new Date().getSeconds(),
    ]);
    formatDate(date);
    setCurrentPage(chosenPage);

    if (chosenPage) {
      if (chosenPage === getQuery) setGetQuery(null);
      else setGetQuery(chosenPage);
  
      activeButton = document.getElementById(chosenPage);
      activeButton.setAttribute('class', 'active-button');

      if (chosenPage === 'failedPulls') inactiveButton = document.getElementById('failedPushes');
      else inactiveButton = document.getElementById('failedPulls');
    }

    inactiveButton.setAttribute('class', 'inactive-button');
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setFormattedDate(formatDate(date));
      if (!click) {
        if (state) {
          if (action === 'Repush') setGetQuery('failedPushes'); // Failed pushes.
          else if (action === 'Repull' || action === 'RepullAllowMismatch') setGetQuery('failedPulls'); // Failed pulls.
        }
        if (getQuery) {
          document.getElementById(getQuery).setAttribute('class', 'active-button');
          document.getElementById(getQuery === 'failedPulls' ? 'failedPushes' : 'failedPulls').setAttribute('class', 'inactive-button');
        }
      } else {
        if (!getQuery) setGetQuery(currentPage);
        if (getQuery) {
          document.getElementById(getQuery).setAttribute('class', 'active-button');
          document.getElementById(getQuery === 'failedPulls' ? 'failedPushes' : 'failedPulls').setAttribute('class', 'inactive-button');
        }
      }

      if (sessionStorage.getItem('action')) {
        setClick(false);
        sessionStorage.clear();
      }
    }
    return () => (mounted = false);
  }, [date, state, click, action, currentPage, getQuery]);
  
  return getQuery ? (
    <>
      <div className='order-actions'>
        <form>
          <button id='failedPulls' value='failedPulls' onClick={handleClick}>
            Failed to Pull
          </button>
        </form>
        <form>
          <button id='failedPushes' value='failedPushes' onClick={handleClick}>
            Failed to Push
          </button>
        </form>
        <p>
          as of {formattedDate.day} {formattedDate.month} {formattedDate.year} at{' '}
          {formattedDate.hour}:{formattedDate.minutes}:{formattedDate.seconds}{' '}
          {formattedDate.amOrPm}
        </p>
      </div>
      <Api getQuery={getQuery} postPath={postPath} order={!click ? order : ''} action={action} callerId={id} />
    </>
  ) : (
    ''
  );
};

export default FailedOrders;
