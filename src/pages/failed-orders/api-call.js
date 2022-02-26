import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Unpulled from './unpulled';
import Unpushed from './unpushed';

const Api = props => {
  const [unpushed, setUnpushed] = useState([]);
  const [unpulled, setUnpulled] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [path, setPath] = useState(null);

  const recallApi = path => {
    setPath(path);
  };

  useEffect(() => {
    let mounted = true;
    axios({
      method: 'get',
      baseURL: process.env.REACT_APP_API,
      url: path ? path : props.getPath,
    }).then(
      res => {
        if (mounted) {
          if (props.getPath === 'StagingOrders/Failed') {
            setUnpushed(res.data);
            setIsLoaded(true);
            setError(null);
          } else if (props.getPath === 'CrmOrders/Failed') {
            setUnpulled(res.data);
            setIsLoaded(true);
            setError(null);
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
    setPath(null);
    return () => (mounted = false);
  }, [props.getPath, path]);

  useEffect(() => {
    if (props.callerId === 'order-details' && props.getPath !== 'StagingOrders/Failed') 
      setPath('StagingOrder/Failed');
  }, [props.callerId, props.getPath]);

  return (
    <>
      <Unpulled
        data={unpulled}
        error={error}
        isLoaded={isLoaded}
        getPath={props.getPath}
        postPath={props.postPath}
        recall={recallApi}
        order={props.order}
        action={props.action}
      />
      <Unpushed
        data={unpushed}
        error={error}
        isLoaded={isLoaded}
        getPath={props.getPath}
        postPath={props.postPath}
        recall={recallApi}
        order={props.order}
        action={props.action}
      />
    </>
  );
};

export default Api;
