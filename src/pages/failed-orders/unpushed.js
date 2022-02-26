import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Checkbox from '../../components/checkbox';
import useSort from '../../hooks/sort-data';
import formatCurrency from '../../components/format-currency';

const UnPushed = props => {
  const [allChecked, setAllChecked] = useState(false);
  const [isChecked, setIsChecked] = useState([]);
  const [status, setStatus] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [unpushed, setUnpushed] = useState([]);
  const [activeLink, setActiveLink] = useState(false);
  const [chars, setChars] = useState(999);
  const [width, setWidth] = useState(window.innerWidth);
  const [noLink, setNoLink] = useState(false);
  const [shortenDates, setShortenDates] = useState(false);

  // Call the sorting hook.
  const { items, requestSort, sortConfig } = useSort(
    unpushed,
    'unpushed'
  );
  // Determine class is ascending or descending.
  const getClassNamesFor = name => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  // Post api call for action buttons on selection of one or more failed items.
  const apiCall = (path, orders, method) => {
    let pathWithId = null;
    console.log({method});
    if (method === 'DELETE') pathWithId = `${path}/${orders[0]}`;
    axios({
      method: method,
      baseURL: process.env.REACT_APP_API,
      url: pathWithId ? pathWithId : path,
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

  // Retry / Ignore / Delete actions: POST: /api/StagingOrders/Retry / Ignore / Delete
  const action = (path, action) => {
    let method = 'POST';
    if (action === 'Delete') {
      method = 'DELETE';
    }
    if (isChecked.length !== 0) apiCall(path, isChecked, method);
    else alert('Please tick an order.');
    setIsChecked([]);
    setAllChecked(false);
    props.recall('StagingOrders/Failed');
  };

  const handleSelectAll = event => {
    // Because the setting of state is asynchronous, this next line will not set allChecked to its opposite until after setChecked runs, meaning that when allChecked === true, its a step behind, explaining why setChecked is emptied.
    setAllChecked(!allChecked);
    setIsChecked(unpushed.map(item => item.orderNumber));
    if (allChecked) setIsChecked([]);
  };

  const handleSelect = event => {
    const { value, checked } = event.target;
    setIsChecked([...isChecked, value]);
    if (!checked) setIsChecked(isChecked.filter(item => item !== value));
  };

  const showError = event => {
    const id = event.target.attributes.name.nodeValue;
    const errorElement = document.getElementById(id);
    if (errorElement) errorElement.setAttribute('id', 'show-error');
  };

  const closeError = event => {
    const errorElement = document.getElementById('show-error');
    let id;
    if (event.target.parentElement.attributes.name.nodeValue) id = event.target.parentElement.attributes.name.nodeValue;
    if (errorElement) errorElement.setAttribute('id', id);
  };

  const clickSniffer = event => {
    let id;
    const errorElement = document.getElementById('show-error');
    if (errorElement && !event.target.attributes.name) {
      id = errorElement.attributes.name.nodeValue;
      errorElement.setAttribute('id', id);
    } 
    return () => {
      // Unbind the event listener on clean up.
      document.removeEventListener("mousedown", clickSniffer);
    };
  }

  // Display a message to the user indicating which action has been taken and on what ID number.
  const message = (action) => {
    let pastTenseVerb = null;
    if (action) {
      // if (action === 'Repull') pastTenseVerb = 'repulled';
      // if (action === 'RepullAllowMimatch')
      //   pastTenseVerb = 'repulled with mismatch';
      if (action === 'Repush') pastTenseVerb = 'repushed';
      if (action === 'Ignore') pastTenseVerb = 'ignored';
      if (action === 'Delete') pastTenseVerb = 'deleted';
      // if (action === 'Pull') pastTenseVerb = 'pulled';
      // if (action === 'Push') pastTenseVerb = 'pushed';
    }
    return pastTenseVerb;
  };

    // Display long or short versions of the date based on browser width.
    const shortOrderDates = document.getElementsByClassName('order-dates true');
    const longOrderDates = document.getElementsByClassName('order-dates false');
  
    if (items.length > 0) {
      if (shortenDates && shortOrderDates.length > 0) {
        for (let i = 0; i < items.length; i++) {
          const cell = shortOrderDates[i];
          cell.textContent = items[i].orderDate.split('T')[0]
        };
      } else if (!shortenDates && longOrderDates.length > 0) {
        for (let i = 0; i < items.length; i++) {
          const cell = longOrderDates[i];
          cell.textContent = `${items[i].orderDate.split('T')[0]} at ${items[i].orderDate.split('T')[1].substring(0, 5)}`;
        };
      }
    }
  
  useEffect(() => {
    setUnpushed(props.data);
  }, [props.data]);

  useEffect(() => {
    if (isChecked.length === unpushed.length) setAllChecked(true);
    else setAllChecked(false);
  }, [isChecked, unpushed]);

  useEffect(() => {
    if (isChecked.length > 0) setActiveLink(true);
    else setActiveLink(false);
  }, [isChecked]);

  useEffect(() => {
    // Bind the event listener.
    document.addEventListener("mousedown", clickSniffer);
  });

// Determine the width of the browser window and set toggles accordingly.
  useLayoutEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    
    if (width < 1280) setShortenDates(true);
    setChars(width < 768 ? 12 : width < 1023 ? 24 : width < 1280 ? 48 : 999);
    
    items.forEach(item => {
      if (item.errorMessage) setNoLink(item.errorMessage.length < chars ? true : false);
    })

    window.onresize = handleResize;
  }, [width, chars, items]);

  return props.error ? (
    <div>{props.error.message}</div>
    ) : !props.isLoaded ? (
      <div>Loading...</div>
    ) : props.getPath === 'StagingOrders/Failed' ? (
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
                    postPath: 'StagingOrders',
                    action: 'Repush',
                    id: 'unpushed'
                  },
                }}
                onClick={() => action('StagingOrders/Retry')}
              >
                Repush
              </Link>
              <Link
                to={{
                  pathname: '/failed-orders',
                  state: {
                    order: isChecked,
                    postPath: 'StagingOrders',
                    action: 'Ignore',
                    id: 'unpushed'
                  },
                }}
                onClick={() => action('StagingOrders/Ignore')}
              >
                Ignore
              </Link>
              <Link
                to={{
                  pathname: '/failed-orders',
                  state: {
                    order: isChecked,
                    postPath: 'StagingOrders',
                    action: 'Delete',
                    id: 'unpushed'
                  },
                }}
                onClick={() => action('StagingOrders/Failed', 'Delete')}
              >
                Delete
              </Link>
            </form>
          </div>
        ) : status !== 200 && response ? (
          <div>Error: {error}</div>
        ) : (
          ''
        )}
      {!error ? (
        props.order && props.action && !activeLink && (props.action === 'Repush' || props.action === 'Ignore' || props.action === 'Delete') ? (
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
      )}
      </div>
      
      <table className="unpushed-table-large">
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
              onClick={() => requestSort('market')}
              className={getClassNamesFor('market')}
            >
              Market
            </th>
            <th
              onClick={() => requestSort('warehouse')}
              className={getClassNamesFor('warehouse')}
            >
              Warehouse
            </th>
            <th
              onClick={() => requestSort('orderTotalAmount')}
              className={getClassNamesFor('orderTotalAmount')}
            >
              Total
            </th>
            <th
              onClick={() => requestSort('customerNumber')}
              className={getClassNamesFor('customerNumber')}
            >
              Customer
            </th>
            <th
              onClick={() => requestSort('orderDate')}
              className={getClassNamesFor('orderDate')}
            >
              Date
            </th>
            <th
              onClick={() => requestSort('stagingImportDate')}
              className={getClassNamesFor('stagingImportDate')}
            >
              Staged
            </th>
            <th
              onClick={() => requestSort('errorCode')}
              className={getClassNamesFor('errorCode')}
            >
             Error
            </th>
            <th
              onClick={() => requestSort('errorMessage')}
              className={getClassNamesFor('errorMessage')}
            >
              Message
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
                      state: { order: item.orderNumber, path: 'StagingOrders' },
                    }}
                  >
                    {item.orderNumber}{' '}
                  </Link>
                </td>
                <td className="reduceable-td">{item.market}</td>
                <td>{item.warehouse}</td>
                <td>
                  {item.market === 'CAN'
                    ? formatCurrency(item.orderTotalAmount, 'CAD')
                    : item.market === 'PHL'
                    ? formatCurrency(item.orderTotalAmount, 'PHP')
                    : formatCurrency(item.orderTotalAmount)}
                </td>
                <td className="reduceable-td">{item.customerNumber}</td>
                <td>{item.orderDate.split('T')[0]}</td>
                <td className={`order-dates ${shortenDates}`}>
                  {item.stagingImportDate.split('T')[0]} at{' '}
                  {item.stagingImportDate.split('T')[1].substring(0, 5)}
                </td>
                <td>{item.errorCode ? item.errorCode : 'None'}</td>
                <td className="unpushed-error-message">
                  <span className={`error-message-button ${noLink}`} title={item.errorMessage.length > chars ? "Click to view the error." : ''} onClick={item.errorMessage.length > chars ? showError : null} name={item.orderNumber}>
                    {item.errorMessage.includes('\r\n') ? `${item.errorMessage.split('\r\n').join(' ').slice(0, chars)}` : `${item.errorMessage.slice(0, chars)}`}
                    {item.errorMessage.length > chars ? ' (...)' : ''}

                  </span>
                </td>
              </tr>
          ))
        ) : (
            <tr>
              <td className='hidden-checkbox'></td>
              <td>None</td>
              <td>None</td>
              <td>None</td>
              <td>None</td>
              <td>None</td>
              <td>None</td>
              <td>None</td>
              <td>None</td>
              <td>None</td>
            </tr>
        )}
        </tbody>
      </table>

      <table>
        <thead>
          <tr className='header-row error-message-unpushed'>
            <th
              onClick={() => requestSort('errorMessage')}
              className={getClassNamesFor('errorMessage')}
            >
              Message
            </th>
          </tr>
        </thead>
        {items.length !== 0 ? (
        <tbody >
          {items.map((item, key) => (
            <tr key={key}>
              <td name={item.orderNumber} id={item.orderNumber} className='error-message-unpushed'>
                <span onClick={closeError} className="x-close">X</span>
                {item.errorMessage.includes('\r\n') ? `${item.errorMessage.split('\r\n').join(' ')}` : item.errorMessage}
              </td>
            </tr>
              )
              )}
        </tbody>
        ) : (
          <tbody hidden><tr><td></td></tr></tbody>
        )}
      </table>
    </>
  ) : (
    ''
  );
};

export default UnPushed;
