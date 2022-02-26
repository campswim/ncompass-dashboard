import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Map from './map';
import Params from './params';

export default function ApiCall(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [params, setParams] = useState([]);
  const [map, setMap] = useState([]);

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
          if (props.path === 'config/params') {
            setParams(res.data);
            setIsLoaded(true);
          } else if (props.path === 'config/maps') {
            setMap(res.data);
            setIsLoaded(true);
          }
        }
      },
      err => {
        if (mounted) {
          setError(err);
          setIsLoaded(true);
        }
      }
    );
    return () => (mounted = false);
  }, [props.path]);

  return (
    <>
      <Params
        paramsData={params}
        error={error}
        isLoaded={isLoaded}
        path={props.path}
      />
      <Map mapData={map} error={error} isLoaded={isLoaded} path={props.path} />
    </>
  );
}
