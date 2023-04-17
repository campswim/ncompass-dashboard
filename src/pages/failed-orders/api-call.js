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
    if (mounted) {
      let queryString = `query ${props.getQuery} {${props.getQuery} `;
      queryString += 'failedPushes' === props.getQuery ? `{OrderNumber Market Warehouse OrderTotalAmount CustomerNumber OrderDate StagingImportDate, ErrorCode, ErrorMessage}}` : `{Id, OrderNumber, OrderDate, OrderTotal, CurrencyCode, Message, At, IgnoredAt, Exception}}`;
      
      const graphQlQuery = {
        operation: props.getQuery,
        query: queryString,
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
          if (props.getQuery === 'failedPushes') {
            setUnpushed(res.data);
            setIsLoaded(true);
            setError(null);
          } else if (props.getQuery === 'failedPulls') {
            setUnpulled(res.data);
            setIsLoaded(true);
            setError(null);
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
    }

    return () => (mounted = false);
  }, [props.getQuery, query]);

  useEffect(() => {
    if (props.callerId === 'order-details' && props.getQuery !== 'failedPushes') 
      setQuery('failedPushes');
    else setQuery('failedPulls');
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
        callerId={props.callerId}
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
        callerId={props.callerId}
      />
    </>
  );
};

export default Api;
