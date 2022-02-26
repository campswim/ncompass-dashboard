import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Staged from '../pages/home/staged-one';
import Map from '../pages/settings/map';
import Params from '../pages/settings/params';

export default function ApiCall(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  // Call the api.
  useEffect(() => {
    let mounted = true;
    axios({
      method: 'get',
      baseURL: process.env.REACT_APP_API,
      url: props.path,
    }).then(
      res => {
        if (mounted) {
          setIsLoaded(true);
          if (props.path !== 'stagingOrders/summary/1') setItems(res.data);
          else setItems(res.data);
        }
      },
      err => {
        setIsLoaded(true);
        setError(err);
      }
    );
    return () => (mounted = false);
  }, [items, props.path]);

  return (
    <>
      <Params
        paramsData={items}
        error={error}
        isLoaded={isLoaded}
        path={props.path}
      />
      <Map
        mapData={items}
        error={error}
        isLoaded={isLoaded}
        path={props.path}
      />
      <Staged
        stagedOrders={items}
        error={error}
        isLoaded={isLoaded}
        path={props.path}
      />
    </>
  );
}
