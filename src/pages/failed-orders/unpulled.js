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
    axios({
      method: 'POST',
      baseURL: process.env.REACT_APP_API,
      url: path,
      data: orders,
    }).then(
      res => {
        setResponse(res.data);
        setStatus(res.status);
      },
      err => {
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
    props.recall('CrmOrders/Failed');
  };

  // Handle the toggling of the select-all checkbox.
  const handleSelectAll = () => {
    // Because the setting of state is asynchronous, this next line will not set allChecked to its opposite untl after setChecked runs, meaning that when allChecked === true, its a step behind, explaining why setChecked is emptied.
    setAllChecked(!allChecked);
    setIsChecked(unpulled.map(item => item.orderNumber));
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
      if (action === 'RepullAllowMimatch')
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
        cell.textContent = items[i].orderDate.split('T')[0]
      };
      for (let i = 0; i < items.length; i++) {
        const cell = shortAttemptedDates[i];
        cell.textContent = items[i].at.split('T')[0]
      };
    } else if (!shortenDates && longOrderDates.length > 0 && longAttemptedDates.length > 0 ) {
      for (let i = 0; i < items.length; i++) {
        const cell = longOrderDates[i];
        cell.textContent = `${items[i].orderDate.split('T')[0]} at ${items[i].orderDate.split('T')[1].substring(0, 5)}`;
      };
      for (let i = 0; i < items.length; i++) {
        const cell = longAttemptedDates[i];
        cell.textContent = items[i].at ? `${items[i].at.split('T')[0]} at ${items[i].at.split('T')[1].substring(0, 5)}` : 'None';
      };
    }
  }

  useEffect(() => {
    let mounted = true;
    if (mounted) setUnpulled(props.data);
    return () => (mounted = false);
  }, [props.data]);

  useEffect(() => {
    if (isChecked.length === unpulled.length) setAllChecked(true);
    else setAllChecked(false);
  }, [isChecked, unpulled]);

  useEffect(() => {
    if (isChecked.length > 0) setActiveLink(true);
    else setActiveLink(false);

  }, [isChecked]);

  // Determine the width of the browser window and set toggles accordingly.
  useLayoutEffect(() => {
    const browserWidth = window.innerWidth;
    const handleResize = () => {
      setWidth(window.innerWidth);
    } 
    window.onresize = handleResize;

    if (browserWidth < 768) {
      setToggleShorterError(true);
      setShortenDates(true);
    } else {
      setToggleShorterError(false);
      setShortenDates(false);
    }
  }, [width]);

  return props.error ? (
    <div>{props.error.message}</div>
    ) : !props.isLoaded ? (
      <div>Loading...</div>
    ) : props.getPath === 'CrmOrders/Failed' ? (
    <>
      <div className='order-info'>
        <p className="order-info-number-display">Selected: {isChecked.length}</p>
        <p className="order-info-number-display">Count: {props.data.length}</p>
        {activeLink ? (
          <div className='action-links'>
            <form className='link'>
            <Link
              to={{
                pathname: '/failed-orders',
                state: {
                  order: isChecked,
                  postPath: 'CrmOrders',
                  action: 'Repull',
                  id: 'unpulled'
                },
              }}
              onClick={() => action('CrmOrders/Repull')}
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
        {!error ? (
          props.order && props.action && !activeLink && (props.action === 'Repull' || props.action === 'Ignore' || props.action === 'Delete') ? (
            typeof props.order === 'number' || props.order.length === 1 ? (
              <div className="retried-order-set">
                Order {props.order} has been {message(props.action)}.
              </div>
              ) : (
              <div className="retried-order-set">
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
          typeof props.order === 'number' || props.order.length === 1 ? (
            <div className="retried-order-set">
              The following error occurred when order {props.order} was {message(props.action)}: {error}.
            </div>
            ) : (
              <div className="retried-order-set">
              <p>The was a "{error}" when the following orders were {message(props.action)}:</p>
              <div className='orders-in-array'>
                {props.order.map((id, key) => (
                  <p key={key}>{id}</p>))}
              </div>
            </div>
            )
          )
        }
      </div>

      <table className="unpulled-table-large">
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
            onClick={() => requestSort('orderNumber')}
            className={getClassNamesFor('orderNumber')}
          >
            ID
          </th>
          <th
            onClick={() => requestSort('orderDate')}
            className={getClassNamesFor('orderDate')}
          >
            Date
          </th>
          <th
            onClick={() => requestSort('orderTotal')}
            className={getClassNamesFor('orderTotal')}
          >
            Price
          </th>
          <th
            onClick={() => requestSort('at')}
            className={getClassNamesFor('at')}
          >
            Attempted
          </th>
          <th
            onClick={() => requestSort('message')}
            className={getClassNamesFor('message')}
          >
            Error
          </th>
        </tr>
      </thead>
      <tbody >
      {items.length !== 0 ? (
        items.map((item, key) => (
            <tr key={key}>
              <td className='select-one'>
                <Checkbox
                  type='checkbox'
                  name={item.orderNumber}
                  value={item.orderNumber}
                  handleClick={handleSelect}
                  isChecked={isChecked.includes(item.orderNumber)}
                />
              </td>
              <td>
                <Link
                  to={{
                    pathname: '/order-view',
                    state: { order: item.orderNumber, path: 'CrmOrders' },
                  }}
                >
                  {item.orderNumber}{' '}
                </Link>
              </td>
              <td className={`order-dates ${shortenDates}`}>
                {item.orderDate.split('T')[0]} at{' '}
                {item.orderDate.split('T')[1].substring(0, 5)}
              </td>
              <td>{formatCurrency(item.orderTotalAmount, item.currencyCode)}</td>
              <td className={`attempted-dates ${shortenDates}`}>
                {item.at ? item.at.split('T')[0] : 'None'} at{' '}
                {item.at ? item.at.split('T')[1].substring(0, 5) : null}
              </td>
              <td name={item.orderNumber} className={`error-message ${toggleShorterError}`} onClick={() => showErrorMessage(item.orderNumber)}>{!toggleShorterError ? item.errorMessage : `${item.errorMessage.slice(0, 18)} (...)`}</td>
              <td name={item.orderNumber} id={item.orderNumber} className='error-message-unpulled'>
                <span className="x-close">X</span>
                {item.message}
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
