import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Checkbox from '../../components/checkbox';
import useSort from '../../hooks/sort-data';
import formatCurrency from '../../components/format-currency';

const UnPulled = props => {
  const [allChecked, setAllChecked] = useState(false);
  const [isChecked, setIsChecked] = useState([]);
  const [status, setStatus] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [unpulled, setUnpulled] = useState([]);
  const [activeLink, setActiveLink] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [toggleShorterError, setToggleShorterError] = useState(false);
  const [shortenDates, setShortenDates] = useState(false);

  // Call the sorting algorithm and set the class as ascending or descending.
  const { items, requestSort, sortConfig } = useSort(
    unpulled,
    'unpulled'
  );
  const getClassNamesFor = name => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  // Call the api to return the details of the selected order (on the order-view page).
  const apiCall = (path, orders) => {
    if ('CrmOrders/Ignore' === path || 'CrmOrders/RepullAllowMismatch' === path) {
      setError('This action is currently disabled');
      return;
    }
    const query = path;
    let queryString = `query ${query}($ids: [String]!)`;
    if ('failedPullOrderById' === query) queryString += `{${query}(ids: $ids) {Id, OrderNumber, OrderDate, OrderTotal, CurrencyCode, Message, At, IgnoredAt, Exception}}`;
    const graphQlQuery = {
      operation: query,
      query: queryString ,
      variables: {ids: orders}
    };
    const options = {
      method: 'POST',
      url: process.env.REACT_APP_API,
      data: JSON.stringify(graphQlQuery),
      headers: {'Content-Type': 'application/json'}
    };
      
    axios.request(options).then(
      res => {
        setResponse(res.data);
        setStatus(res.status);
        setError(null);
      },
      err => {
        console.log({err});
        setError(err.message);
      }
    );
  };

  // Repull / Ignore / Repull w/mismatch function: POST: /api/CrmOrders/Repull / Ignore / RepullAllowMismatch
  const action = path => {
    if (isChecked.length !== 0) apiCall(path, isChecked);
    else alert('Please tick an order.');
    setIsChecked([]);
    setAllChecked(false);
    props.recall('failedPulls');

    // Store a flag in localStorage to indicate that a new action has been initiated.
    sessionStorage.setItem('action', true);
  };

  // Handle the toggling of the select-all checkbox.
  const handleSelectAll = () => {
    // Because the setting of state is asynchronous, this next line will not set allChecked to its opposite until after setChecked runs, meaning that when allChecked === true, it's a step behind, explaining why setChecked is emptied.
    const unpulledData = unpulled['data'] && unpulled['data']['failedPulls'] ? unpulled['data']['failedPulls'] : '';
    setAllChecked(!allChecked);
    setIsChecked(unpulledData.map(item => item.OrderNumber));
    if (allChecked) setIsChecked([]);
  };

  // Handle the toggling of a single item's checkbox.
  const handleSelect = event => {
    const { value, checked } = event.target;
    setIsChecked([...isChecked, value]);
    if (!checked) setIsChecked(isChecked.filter(item => item !== value));
  };

  // Set the verb to display in the message for the action links.
  const message = (action) => {
    let pastTenseVerb = null;
    if (action) {
      if (action === 'Repull') pastTenseVerb = 'repulled';
      if (action === 'RepullAllowMismatch')
        pastTenseVerb = 'repulled with mismatch';
      if (action === 'Ignore') pastTenseVerb = 'ignored';
      // if (action === 'Retry') pastTenseVerb = 'repulled';
      // if (action === 'Pull') pastTenseVerb = 'pulled';
      // if (action === 'Push') pastTenseVerb = 'pushed';
    }
    return pastTenseVerb;
  };

  // Handle the click to show a modal with the full error message.
  const showErrorMessage = id => {
    if (!toggleShorterError) return;
    const element = document.getElementById(id);
    element.setAttribute('id', 'show-error');
  }

  // Display long or short versions of the date based on browser width.
  const shortOrderDates = document.getElementsByClassName('order-dates true');
  const longOrderDates = document.getElementsByClassName('order-dates false');
  const shortAttemptedDates = document.getElementsByClassName('attempted-dates true');
  const longAttemptedDates = document.getElementsByClassName('attempted-dates false');

  if (items.length > 0) {
    if (shortenDates && shortOrderDates.length > 0 && shortAttemptedDates.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const cell = shortOrderDates[i];
        const orderDate = new Date(parseInt(items[i].OrderDate)).toISOString();
        cell.textContent = orderDate.split('T')[0];
      };
      for (let i = 0; i < items.length; i++) {
        const cell = shortAttemptedDates[i];
        const orderDate = new Date(parseInt(items[i].OrderDate)).toISOString();
        cell.textContent = orderDate.split('T')[0];
      };
    } else if (!shortenDates && longOrderDates.length > 0 && longAttemptedDates.length > 0 ) {
      for (let i = 0; i < items.length; i++) {
        const cell = longOrderDates[i];
        const orderDate = new Date(parseInt(items[i].OrderDate)).toISOString();
        cell.textContent = `${orderDate.split('T')[0]} at ${orderDate.split('T')[1].substring(0, 5)}`;
      };
      for (let i = 0; i < items.length; i++) {
        const cell = longAttemptedDates[i];
        const at = new Date(parseInt(items[i].At)).toISOString();
        cell.textContent = items[i].at ? `${at.split('T')[0]} at ${at.split('T')[1].substring(0, 5)}` : 'None';
      };
    }
  }

  useEffect(() => {
    let mounted = true;
    if (mounted) setUnpulled(props.data);
    return () => mounted = false;
  }, [props]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const unpulledData = unpulled['data'] && unpulled['data']['failedPulls'] ? unpulled['data']['failedPulls'] : '';
      if (unpulledData && isChecked.length === unpulledData.length) setAllChecked(true);
      else setAllChecked(false);
    }
    return () => mounted = false;
  }, [isChecked, unpulled]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const element = document.getElementById('retried-order-message');
      if (isChecked.length > 0) {
        const className = element ? element.getAttribute('class') : '';  
        if (className && !className.includes('hidden')) element.setAttribute('class', `${className}-hidden`);
        setActiveLink(true);
      } else {
        const className = element ? element.getAttribute('class').replace('-hidden', '') : ''; 
        if (className) element.setAttribute('class', className);
        setActiveLink(false);
      }
    }
    return () => mounted = false;
  }, [isChecked]);

  // Determine the width of the browser window and set toggles accordingly.
  useLayoutEffect(() => {
    let mounted = true;
    const browserWidth = window.innerWidth;
    const handleResize = () => {
      setWidth(window.innerWidth);
    } 
    window.onresize = handleResize;

    if (mounted) {
      if (browserWidth < 768) {
        setToggleShorterError(true);
        setShortenDates(true);
      } else {
        setToggleShorterError(false);
        setShortenDates(false);
      }
    }
    return () => mounted = false;
  }, [width]);
  
  return props.error ? (
    <div>{props.error.message}</div>
    ) : !props.isLoaded ? (
      <div>Loading...</div>
    ) : props.getQuery === 'failedPulls' ? (
    <>
      <div className="order-info">
        <p className="order-info-number-display">Selected: {isChecked.length}</p>
        <p className="order-info-number-display">Count: {items.length}</p>
        {activeLink ? (
          <div className="action-links">
            <form className="link">
              <Link
                to={{
                  pathname: '/failed-orders',
                  state: {
                    order: isChecked,
                    postPath: 'failedPulls',
                    action: 'Repull',
                    id: 'unpulled'
                  },
                }}
                onClick={() => action('failedPullOrderById')}
              >
                Repull
              </Link>
              <Link
                to={{
                  pathname: '/failed-orders',
                  state: {
                    order: isChecked,
                    postPath: 'CrmOrders',
                    action: 'Ignore',
                    id: 'unpulled'
                  },
                }}
                onClick={() => action('CrmOrders/Ignore')}
              >
                Ignore
              </Link>
              <Link
                to={{
                  pathname: '/failed-orders',
                  state: {
                    order: isChecked,
                    postPath: 'CrmOrders',
                    action: 'RepullAllowMismatch',
                    id: 'unpulled'
                  },
                }}
                onClick={() => action('CrmOrders/RepullAllowMismatch')}
              >
                Repull w/ Mismatch
              </Link>
            </form>
          </div>
        ) : status !== 200 && response ? (
          <div>Error: {error}</div>
        ) : (
          ''
        )}
        {props.callerId === 'unpulled' ? (
          !error ? (
            props.order ? (
              props.action && !activeLink && (props.action === 'Repull' || props.action === 'Ignore' || props.action === 'Delete') ? (
                typeof props.order === 'number' || props.order.length === 1 ? (
                  <div className="retried-order-set" id="retried-order-message">
                    Order {props.order} has been {message(props.action)}.
                  </div>
                  ) : (
                  <div className="retried-order-set" id="retried-order-message">
                    <p>The following orders have been {message(props.action)}:</p>
                    <div className='orders-in-array'>
                      {props.order.map((id, key) => (
                        <p key={key}>{id}</p>))}
                    </div>
                  </div>
                  )
                ) : (
                ''
                ) 
            ) : (
              ''
            )
          ) : (
            props.order ? (
              typeof props.order === 'number' || props.order.length === 1 ? (
              <div className="retried-order-set" id="retried-order-message">
                The following error occurred when order {props.order} was {message(props.action)}: {error}.
              </div>
              ) : (
                <div className="retried-order-set" id="retried-order-message">
                <p>There was a "{error}" error when the following orders were {message(props.action)}:</p>
                <div className='orders-in-array'>
                  {props.order.map((id, key) => (
                    <p key={key}>{id}</p>))}
                </div>
              </div>
              )
            ) : (
              ''
            )
          )
        ) : (
          ''
        )}
      </div>

      <table className="unpulled-table-large" id="tab">
        <thead>
          <tr className='header-row'>
          {props.data.length !== 0 ? (
            <th className='checkbox-th'>
            <Checkbox
                type='checkbox'
                name='selectAll'
                handleClick={handleSelectAll}
                isChecked={allChecked}
              />
            </th>
          ) : (
            <th className='hidden-checkbox'></th>
          )}
          <th
            onClick={() => requestSort('OrderNumber')}
            className={getClassNamesFor('OrderNumber')}
          >
            ID
          </th>
          <th
            onClick={() => requestSort('OrderDate')}
            className={getClassNamesFor('OrderDate')}
          >
            Date
          </th>
          <th
            onClick={() => requestSort('OrderTotal')}
            className={getClassNamesFor('OrderTotal')}
          >
            Price
          </th>
          <th
            onClick={() => requestSort('At')}
            className={getClassNamesFor('At')}
          >
            Attempted
          </th>
          <th
            onClick={() => requestSort('Message')}
            className={getClassNamesFor('Message')}
          >
            Error
          </th>
        </tr>
      </thead>
      <tbody>
      {items.length !== 0 ? (
        items.map((item, key) => (
          <tr key={key}>
              <td className='select-one'>
                <Checkbox
                  type='checkbox'
                  name={item.OrderNumber}
                  value={item.OrderNumber}
                  handleClick={handleSelect}
                  isChecked={isChecked.includes(item.OrderNumber)}
                />
              </td>
              <td>
                <Link
                  to={{
                    pathname: '/order-view',
                    state: { order: item.OrderNumber, path: 'CrmOrders' },
                  }}
                >
                  {item.OrderNumber}{' '}
                </Link>
              </td>
              <td className={`order-dates ${shortenDates}`}>
                {new Date(parseInt(item.OrderDate)).toISOString().split('T')[0]} at{' '}
                {new Date(parseInt(item.OrderDate)).toISOString().split('T')[1].substring(0, 5)}
              </td>
              <td>{formatCurrency(item.OrderTotal, item.CurrencyCode)}</td>
              <td className={`attempted-dates ${shortenDates}`}>
                {item.At ? new Date(parseInt(item.At)).toISOString().split('T')[0] : 'None'} at{' '}
                {item.At ? new Date(parseInt(item.At)).toISOString().split('T')[1].substring(0, 5) : null}
              </td>
              <td name={item.OrderNumber} className={`error-message ${toggleShorterError}`} onClick={() => showErrorMessage(item.OrderNumber)}>{!toggleShorterError ? item.Message : `${item.Message.slice(0, 18)} (...)`}</td>
              <td name={item.OrderNumber} id={item.OrderNumber} className='error-message-unpulled'>
                <span className="x-close">X</span>
                {item.Message}
              </td>
            </tr>
          )
        )
      ) : (
          <tr>
            <td className='hidden-checkbox'></td>
            <td>None</td>
            <td>None</td>
            <td>None</td>
            <td>None</td>
            <td>None</td>
          </tr>
      )}
      </tbody>
      </table>
    </>
  ) : (
    ''
  );
};

export default UnPulled;
