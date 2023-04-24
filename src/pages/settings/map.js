import React from 'react';
import useSort from '../../hooks/sort-data';

const Map = props => {
  // Call the sorting hook and set class to "ascending" or "descending."
  const { items, requestSort, sortConfig } = useSort(props.mapData.maps, 'map');
  const getClassNamesFor = name => {
    if (!sortConfig) return;
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };
  const error = items.length === 1 && items[0].Error ? items[0].Error : '';
  
  return props.path === 'maps' ? 
  (
    props.error ? 
    ( 
      <div>{props.error.message}</div> 
    ) 
    : !props.isLoaded ? 
    ( 
      <div>Loading...</div> 
    ) 
    : error ? 
    (
      <div>
        <p>{error.name}: {error.message}</p>
      </div>
    ) 
    : 
    (
      <>
        <div className="map-table-large">
          <table className="map-table">
            <thead>
              <tr className='header-row'>
                <th
                  onClick={() => requestSort('Id')}
                  className={`map-id ${getClassNamesFor('Id')}`}
                >
                  ID
                </th>
                <th
                  onClick={() => requestSort('IsoCountryCode')}
                  className={getClassNamesFor('IsoCountryCode')}
                >
                    Country
                </th>
                <th
                  onClick={() => requestSort('ErpCompanyId')}
                  className={getClassNamesFor('ErpCompanyId')}
                >
                    ERP Company ID
                </th>
                <th
                  onClick={() => requestSort('SourceWarehouse')}
                  className={getClassNamesFor('SourceWarehouse')}
                >
                  CRM Warehouse
                </th>
                <th
                  onClick={() => requestSort('SourceShipMethod')}
                  className={getClassNamesFor('SourceShipMethod')}
                >
                  CRM Shipment Method
                </th>
                <th
                  onClick={() => requestSort('DestinationWarehouse')}
                  className={getClassNamesFor('DestinationWarehouse')}
                >
                  ERP Warehouse
                </th>
                {/* <th
                  onClick={() => requestSort('id')}
                  className={`map-id ${getClassNamesFor('id')}`}
                >
                  ID
                </th> */}
                <th
                    onClick={() => requestSort('IsoCurrencyCode')}
                    className={getClassNamesFor('IsoCurrencyCode')}
                  >
                    Currency
                </th>
                <th
                  onClick={() => requestSort('ErpCurrencyCode')}
                  className={getClassNamesFor('ErpCurrencyCode')}
                >
                  ERP Currency
                </th>
                <th
                  onClick={() => requestSort('ProcessingSequence')}
                  className={getClassNamesFor('ProcessingSequence')}
                >
                  Sequence
                </th>
                <th
                  onClick={() => requestSort('ActivatedAt')}
                  className={getClassNamesFor('ActivatedAt')}
                >
                  Activated
                </th>
                <th
                  onClick={() => requestSort('DeactivatedAt')}
                  className={getClassNamesFor('DeactivatedAt')}
                >
                  Deactivated
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, key) => (
                <tr key={key}>
                  <td className="map-id">{item.Id}</td>
                  <td>{item.IsoCountryCode}</td>
                  <td>{item.ErpCompanyId}</td>
                  <td>{item.SourceWarehouse}</td>
                  <td>{item.SourceShipMethod}</td>
                  <td>{item.DestinationWarehouse}</td>
                  <td>{item.IsoCurrencyCode}</td>
                  <td>{item.ErpCurrencyCode}</td>
                  <td>{item.ProcessingSequence ? item.ProcessingSequence : 'None'}</td>
                  <td>
                    {item.ActivatedAt ? new Date(parseInt(item.ActivatedAt)).toISOString().split('T')[0] : 'None'}
                  </td>
                  <td>
                    {item.DeactivatedAt ? new Date(parseInt(item.DeactivatedAt)).toISOString().split('T')[0] : 'None'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="map-tables">
          <table className="map-table-1">
            <thead>
              <tr className='header-row'>
                <th
                  onClick={() => requestSort('Id')}
                  className={`map-id ${getClassNamesFor('Id')}`}
                >
                  ID
                </th>
                <th
                  onClick={() => requestSort('IsoCountryCode')}
                  className={getClassNamesFor('IsoCountryCode')}
                >
                    Country
                </th>
                <th
                  onClick={() => requestSort('ErpCompanyId')}
                  className={getClassNamesFor('ErpCompanyId')}
                >
                    Company
                </th>
                <th
                  onClick={() => requestSort('SourceWarehouse')}
                  className={getClassNamesFor('SourceWarehouse')}
                >
                  CRM Warehouse
                </th>
                <th
                  onClick={() => requestSort('SourceShipMethod')}
                  className={getClassNamesFor('SourceShipMethod')}
                >
                  CRM Shipment Method
                </th>
                <th
                  onClick={() => requestSort('DestinationWarehouse')}
                  className={getClassNamesFor('DestinationWarehouse')}
                >
                  ERP Warehouse
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, key) => (
                <tr key={key}>
                  <td className="map-id">{item.Id}</td>
                  <td>{item.IsoCountryCode}</td>
                  <td>{item.ErpCompanyId}</td>
                  <td>{item.SourceWarehouse}</td>
                  <td>{item.SourceShipMethod}</td>
                  <td>{item.DestinationWarehouse}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <table className="map-table-2">
          <thead>
            <tr className='header-row'>
              <th
                onClick={() => requestSort('Id')}
                className={`map-id ${getClassNamesFor('Id')}`}
              >
                ID
              </th>
              <th
                  onClick={() => requestSort('IsoCurrencyCode')}
                  className={getClassNamesFor('IsoCurrencyCode')}
                >
                  Currency
              </th>
              <th
                onClick={() => requestSort('ErpCurrencyCode')}
                className={getClassNamesFor('ErpCurrencyCode')}
              >
                ERP Currency
              </th>
              <th
                onClick={() => requestSort('ProcessingSequence')}
                className={getClassNamesFor('ProcessingSequence')}
              >
                Sequence
              </th>
              <th
                onClick={() => requestSort('ActivatedAt')}
                className={getClassNamesFor('ActivatedAt')}
              >
                Activated
              </th>
              <th
                onClick={() => requestSort('DeactivatedAt')}
                className={getClassNamesFor('DeactivatedAt')}
              >
                Deactivated
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, key) => (
              <tr key={key}>
                <td className="map-id">{item.Id}</td>
                <td>{item.IsoCurrencyCode}</td>
                <td>{item.ErpCurrencyCode}</td>
                <td>{item.ProcessingSequence ? item.ProcessingSequence : 'None'}</td>
                <td>
                    {item.ActivatedAt ? new Date(parseInt(item.ActivatedAt)).toISOString().split('T')[0] : 'None'}
                  </td>
                  <td>
                    {item.DeactivatedAt ? new Date(parseInt(item.DeactivatedAt)).toISOString().split('T')[0] : 'None'}
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="map-tables-mobile">
        <table className=" map-table-1">
          <thead>
            <tr className='header-row'>
              <th
                onClick={() => requestSort('Id')}
                className={`map-id ${getClassNamesFor('Id')}`}
              >
                ID
              </th>
              <th
                onClick={() => requestSort('IsoCountryCode')}
                className={getClassNamesFor('IsoCountryCode')}
              >
                  Country
              </th>
              <th
                onClick={() => requestSort('ErpCompanyId')}
                className={getClassNamesFor('ErpCompanyId')}
              >
                  Company
              </th>
              <th
                onClick={() => requestSort('SourceWarehouse')}
                className={getClassNamesFor('SourceWarehouse')}
              >
                CRM Warehouse
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, key) => (
              <tr key={key}>
                <td className="map-id">{item.Id}</td>
                <td>{item.IsoCountryCode}</td>
                <td>{item.ErpCompanyId}</td>
                <td>{item.SourceWarehouse}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className=" map-table-2">
          <thead>
            <tr className='header-row'>
              <th
                onClick={() => requestSort('Id')}
                className={`map-id ${getClassNamesFor('Id')}`}
              >
                ID
              </th>
              <th
                onClick={() => requestSort('SourceShipMethod')}
                className={getClassNamesFor('SourceShipMethod')}
              >
                CRM Shipment Method
              </th>
              <th
                onClick={() => requestSort('ErpWarehouse')}
                className={getClassNamesFor('ErpWarehouse')}
              >
                ERP Warehouse
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, key) => (
              <tr key={key}>
                <td className="map-id">{item.Id}</td>
                <td>{item.SourceShipMethod}</td>
                <td>{item.ErpWarehouse}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="map-table-3">
          <thead>
            <tr className='header-row'>
              <th
                onClick={() => requestSort('Id')}
                className={`map-id ${getClassNamesFor('Id')}`}
              >
                ID
              </th>
              <th
                  onClick={() => requestSort('IsoCurrencyCode')}
                  className={getClassNamesFor('IsoCurrencyCode')}
                >
                  Currency
              </th>
              <th
                onClick={() => requestSort('ErpCurrencyCode')}
                className={getClassNamesFor('ErpCurrencyCode')}
              >
                ERP Currency
              </th>
              <th
                onClick={() => requestSort('ProcessingSequence')}
                className={getClassNamesFor('ProcessingSequence')}
              >
                Sequence
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, key) => (
              <tr key={key}>
                <td className="map-id">{item.Id}</td>
                <td>{item.IsoCurrencyCode}</td>
                <td>{item.ErpCurrencyCode}</td>
                <td>{item.ProcessingSequence ? item.ProcessingSequence : 'None'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="map-table-4">
          <thead>
            <tr className='header-row'>
              <th
                onClick={() => requestSort('Id')}
                className={`map-id ${getClassNamesFor('Id')}`}
              >
                ID
              </th>
              <th
                onClick={() => requestSort('ActivatedAt')}
                className={getClassNamesFor('ActivatedAt')}
              >
                Activated
              </th>
              <th
                onClick={() => requestSort('DeactivatedAt')}
                className={getClassNamesFor('DeactivatedAt')}
              >
                Deactivated
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, key) => (
              <tr key={key}>
                <td className="map-id">{item.Id}</td>
                <td>
                    {item.ActivatedAt ? new Date(parseInt(item.ActivatedAt)).toISOString().split('T')[0] : 'None'}
                  </td>
                  <td>
                    {item.DeactivatedAt ? new Date(parseInt(item.DeactivatedAt)).toISOString().split('T')[0] : 'None'}
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>

    )
  ) : (
    ''
  );
};

export default Map;
