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
    if (mounted && props.path) {
      let queryString = `query ${props.path} {${props.path} `;
      queryString += 'maps' === props.path ? `{Id IsoCountryCode ErpCompanyId IsoCurrencyCode ErpCurrencyCode SourceWarehouse SourceShipMethod DestinationWarehouse ReturnsWarehouse IsVAT UseForErpPull ProcessingSequence ActivatedAt DeactivatedAt CreatedAt CreatedBy ModifiedAt ModifiedBy}}` : `{Name Value ModuleId Category SubCategory ValueType Notes EnabledDate CreatedAt CreatedBy ModifiedAt ModifiedBy}}`;
      
      const graphQlQuery = {
        operation: props.path,
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
          if (props.path === 'params') {
            setParams(res.data.data);
            setIsLoaded(true);
          } else if (props.path === 'maps') {
            setMap(res.data.data);
            setIsLoaded(true);
          }
        },
        err => {
          if (mounted) {
            setError(err);
            setIsLoaded(true);
          }
        }
      );
    }
    return () => (mounted = false);
  }, [props.path]);
      
  return (
    <>
      <Params
        paramsData={params}
        error={error}
        isLoaded={isLoaded}
        path={props.path}
        reCallApi={props.reCallApi}
      />
      <Map 
        mapData={map} 
        error={error} 
        isLoaded={isLoaded} 
        path={props.path} />
    </>
  );
}
