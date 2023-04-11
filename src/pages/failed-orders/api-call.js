import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Unpulled from './unpulled';
import Unpushed from './unpushed';

const Api = props => {
  const [unpushed, setUnpushed] = useState([]);
  const [unpulled, setUnpulled] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [query, setQuery] = useState(props.getQuery);
  
  const recallApi = query => {
    setQuery(query);
  };

  useEffect(() => {   
    let mounted = true;
    let queryString = `query ${query}`;
    queryString = 'failedPushes' === query ? queryString + `{${query} {OrderNumber Market Warehouse OrderTotalAmount CustomerNumber OrderDate StagingImportDate, ErrorCode, ErrorMessage}}` : queryString + `{${query} {id, orderNumber, orderDate, orderTotal, currencyCode, message, at, ignoredAt, exception}}`;
    
    const graphQlQuery = {
      operation: query,
      query: queryString ,
      variables: {}
    };
  
    const options = {
      method: 'POST',
      url: process.env.REACT_APP_API,
      data: JSON.stringify(graphQlQuery),
      headers: {'Content-Type': 'application/json'}
    };

    axios.request(options).then(
      res => {
        console.log({res});
        if (mounted) {
          if (props.getQuery === 'failedPushes') {
            setUnpushed(res.data);
            setIsLoaded(true);
            setError(null);
          } else if (props.getQuery === 'failedPulls') {
            setUnpulled(res.data);
            setIsLoaded(true);
            setError(null);
          }
        }
      },
      err => {
        console.log({err});
        if (mounted) {
          setError(err);
          setIsLoaded(true);
        }
      }
    );
    // setQuery(null);

    return () => (mounted = false);
  }, [props.getQuery, query]);

  useEffect(() => {
    if (props.callerId === 'order-details' && props.getQuery !== 'failedPushes') 
      setQuery('failedPushes');
  }, [props.callerId, props.getQuery]);

  return (
    <>
      <Unpulled
        data={unpulled}
        error={error}
        isLoaded={isLoaded}
        getQuery={props.getQuery}
        postPath={props.postPath}
        recall={recallApi}
        order={props.order}
        action={props.action}
      />
      <Unpushed
        data={unpushed}
        error={error}
        isLoaded={isLoaded}
        getQuery={props.getQuery}
        postPath={props.postPath}
        recall={recallApi}
        order={props.order}
        action={props.action}
      />
    </>
  );
};

export default Api;
