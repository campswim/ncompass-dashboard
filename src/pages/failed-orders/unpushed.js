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
  const apiCall = (path, orders) => {
    if ('failedPushOrderById' === path || 'StagingOrders/Ignore' === path || 'StagingOrders/Failed' === path) {
      setError('This action is currently disabled');
      return;
    }
    
    const query = path;
    let queryString = `query ${query}($ids: [String]!)`;
    // Define the graphQL query string here based on the path. See unpulled for a model.
    const graphQlQuery = {
      operation: query,
      query: queryString,
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

  // Retry / Ignore / Delete actions: POST: /api/StagingOrders/Retry / Ignore / Delete
  const action = (path) => {
    if (isChecked.length !== 0) apiCall(path, isChecked);
    else alert('Please tick an order.');
    setIsChecked([]);
    setAllChecked(false);
    props.recall('failedPushes');

    // Store a flag in localStorage to indicate that a new action has been initiated.
    sessionStorage.setItem('action', true);
  };

  const handleSelectAll = () => {
    // Because the setting of state is asynchronous, this next line will not set allChecked to its opposite until after setChecked runs, meaning that when allChecked === true, it's a step behind, explaining why setChecked is emptied.
    const unpushedData = unpushed['data'] && unpushed['data']['failedPushes'] ? unpushed['data']['failedPushes'] : '';
    setAllChecked(!allChecked);
    setIsChecked(unpushedData.map(item => item.OrderNumber));
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
        const orderDate = new Date(parseInt(items[i].OrderDate)).toISOString();
        cell.textContent = orderDate.split('T')[0];
      };
    } else if (!shortenDates && longOrderDates.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const cell = longOrderDates[i];
        const orderDate = new Date(parseInt(items[i].OrderDate)).toISOString();
        cell.textContent = `${orderDate.split('T')[0]} at ${orderDate.split('T')[1].substring(0, 5)}`;
      };
    }
  }
  
  useEffect(() => {
    setUnpushed(props.data);
  }, [props.data]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const unpushedData = unpushed['data'] && unpushed['data']['failedPushes'] ? unpushed['data']['failedPushes'] : '';
      if (unpushedData && isChecked.length === unpushedData.length) setAllChecked(true);
      else setAllChecked(false);
    }
    return () => mounted = false;
  }, [isChecked, unpushed]);

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
      if (item.ErrorMessage) setNoLink(item.ErrorMessage.length < chars ? true : false);
    })

    window.onresize = handleResize;
  }, [width, chars, items]);

  return props.error ? (
    <div>{props.error.message}</div>
  ) : props.getQuery === 'failedPushes' ? (
    <>
      <div className='order-info'>
        <p className="order-info-number-display">Selected: {isChecked.length}</p>
        <p className="order-info-number-display">Count: {items.length}</p>
          {activeLink ? (
            <div className='action-links'>
              <form className='link'>
                <Link
                    to={{
                      pathname: '/failed-orders',
                      state: {
                        order: isChecked,
                        postPath: 'failedPushes',
                        action: 'Repush',
                        id: 'unpushed'
                      },
                    }}
                    onClick={() => action('failedPushOrderById')}
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
        {props.callerId === 'unpushed' ? (
          !error ? (
            props.order ? (
              props.action && !activeLink && (props.action === 'Repush' || props.action === 'Ignore' || props.action === 'Delete') ? (
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
        
      <table className="unpushed-table-large" id="tab">
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
              onClick={() => requestSort('Market')}
              className={getClassNamesFor('Market')}
            >
              Market
            </th>
            <th
              onClick={() => requestSort('Warehouse')}
              className={getClassNamesFor('Warehouse')}
            >
              Warehouse
            </th>
            <th
              onClick={() => requestSort('OrderTotalAmount')}
              className={getClassNamesFor('OrderTotalAmount')}
            >
              Total
            </th>
            <th
              onClick={() => requestSort('CustomerNumber')}
              className={getClassNamesFor('CustomerNumber')}
            >
              Customer
            </th>
            <th
              onClick={() => requestSort('OrderDate')}
              className={getClassNamesFor('OrderDate')}
            >
              Date
            </th>
            <th
              onClick={() => requestSort('StagingImportDate')}
              className={getClassNamesFor('StagingImportDate')}
            >
              Staged
            </th>
            <th
              onClick={() => requestSort('ErrorCode')}
              className={getClassNamesFor('ErrorCode')}
            >
              Error
            </th>
            <th
              onClick={() => requestSort('ErrorMessage')}
              className={getClassNamesFor('ErrorMessage')}
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
                    name={item.OrderNumber}
                    value={item.OrderNumber}
                    handleClick={handleSelect}
                    isChecked={isChecked.includes(item.OrderNumber)}
                  />
                </td>
                <td>
                  {/* <Link
                    to={{
                      pathname: '/order-view',
                      state: { order: item.OrderNumber, path: 'StagingOrders' },
                    }}
                  >
                    {item.OrderNumber}{' '}
                  </Link> */}
                  {item.OrderNumber}
                </td>
                <td className="reduceable-td">{item.Market}</td>
                <td>{item.Warehouse}</td>
                <td>
                  {item.Market === 'CAN'
                    ? formatCurrency(item.OrderTotalAmount, 'CAD')
                    : item.Market === 'PHL'
                    ? formatCurrency(item.OrderTotalAmount, 'PHP')
                    : formatCurrency(item.OrderTotalAmount)}
                </td>
                <td className="reduceable-td">{item.CustomerNumber}</td>
                <td>{new Date(parseInt(item.OrderDate)).toISOString().split('T')[0]}</td>
                <td className={`order-dates ${shortenDates}`}>
                  {new Date(parseInt(item.StagingImportDate)).toISOString().split('T')[0]} at{' '}
                  {new Date(parseInt(item.StagingImportDate)).toISOString().split('T')[1].substring(0, 5)}
                </td>
                <td>{item.ErrorCode ? item.ErrorCode : 'None'}</td>
                <td className="unpushed-error-message">
                  <span className={`error-message-button ${noLink}`} title={item.ErrorMessage.length > chars ? "Click to view the error." : ''} onClick={item.ErrorMessage.length > chars ? showError : null} name={item.OrderNumber}>
                    {item.ErrorMessage.includes('\r\n') ? `${item.ErrorMessage.split('\r\n').join(' ').slice(0, chars)}` : `${item.ErrorMessage.slice(0, chars)}`}
                    {item.ErrorMessage.length > chars ? ' (...)' : ''}

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
              <td name={item.OrderNumber} id={item.OrderNumber} className='error-message-unpushed'>
                <span onClick={closeError} className="x-close">X</span>
                {item.ErrorMessage.includes('\r\n') ? `${item.ErrorMessage.split('\r\n').join(' ')}` : item.ErrorMessage}
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
