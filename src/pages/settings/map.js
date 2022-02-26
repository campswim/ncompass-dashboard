import React from 'react';
import useSort from '../../hooks/sort-data';

const Map = props => {
  // Call the sorting hook and set class to "ascending" or "descending."
  const { items, requestSort, sortConfig } = useSort(props.mapData, 'map');
  const getClassNamesFor = name => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  return props.error ? (
    <div>{props.error.message}</div>
  ) : !props.isLoaded ? (
    <div>Loading...</div>
  ) : props.path === 'config/maps' ? (
    <>
      <div className="map-table-large">
        <table className="map-table">
          <thead>
            <tr className='header-row'>
              <th
                onClick={() => requestSort('id')}
                className={`map-id ${getClassNamesFor('id')}`}
              >
                ID
              </th>
              <th
                onClick={() => requestSort('isoCountryCode')}
                className={getClassNamesFor('isoCountryCode')}
              >
                  Country
              </th>
              <th
                onClick={() => requestSort('gpCompanyId')}
                className={getClassNamesFor('gpCompanyId')}
              >
                  Company
              </th>
              <th
                onClick={() => requestSort('sourceWarehouse')}
                className={getClassNamesFor('sourceWarehouse')}
              >
                CRM Warehouse
              </th>
              <th
                onClick={() => requestSort('sourceShipMethod')}
                className={getClassNamesFor('sourceShipMethod')}
              >
                CRM Shipment Method
              </th>
              <th
                onClick={() => requestSort('gpWarehouse')}
                className={getClassNamesFor('gpWarehouse')}
              >
                GP Warehouse
              </th>
              <th
                onClick={() => requestSort('rm00201Classid')}
                className={getClassNamesFor('rm00201Classid')}
              >
                Class
              </th>
              <th
                onClick={() => requestSort('id')}
                className={`map-id ${getClassNamesFor('id')}`}
              >
                ID
              </th>
              <th
                  onClick={() => requestSort('isoCurrencyCode')}
                  className={getClassNamesFor('isoCurrencyCode')}
                >
                  Currency
              </th>
              <th
                onClick={() => requestSort('gpCurrencyCode')}
                className={getClassNamesFor('gpCurrencyCode')}
              >
                GP Currency
              </th>
              <th
                onClick={() => requestSort('processingSequence')}
                className={getClassNamesFor('processingSequence')}
              >
                Sequence
              </th>
              <th
                onClick={() => requestSort('activatedAt')}
                className={getClassNamesFor('activatedAt')}
              >
                Activated
              </th>
              <th
                onClick={() => requestSort('deactivatedAt')}
                className={getClassNamesFor('deactivatedAt')}
              >
                Deactivated
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, key) => (
              <tr key={key}>
                <td className="map-id">{item.id}</td>
                <td>{item.isoCountryCode}</td>
                <td>{item.gpCompanyId}</td>
                <td>{item.sourceWarehouse}</td>
                <td>{item.sourceShipMethod}</td>
                <td>{item.gpWarehouse}</td>
                <td>{item.rm00201Classid}</td>
                <td>{item.isoCurrencyCode}</td>
                <td>{item.gpCurrencyCode}</td>
                <td>{item.processingSequence}</td>
                <td>
                  {item.activatedAt ? item.activatedAt.split('T')[0] : 'None'}
                </td>
                <td>
                  {item.deactivatedAt ? item.deactivatedAt.split('T')[0] : 'None'}
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
                onClick={() => requestSort('id')}
                className={`map-id ${getClassNamesFor('id')}`}
              >
                ID
              </th>
              <th
                onClick={() => requestSort('isoCountryCode')}
                className={getClassNamesFor('isoCountryCode')}
              >
                  Country
              </th>
              <th
                onClick={() => requestSort('gpCompanyId')}
                className={getClassNamesFor('gpCompanyId')}
              >
                  Company
              </th>
              <th
                onClick={() => requestSort('sourceWarehouse')}
                className={getClassNamesFor('sourceWarehouse')}
              >
                CRM Warehouse
              </th>
              <th
                onClick={() => requestSort('sourceShipMethod')}
                className={getClassNamesFor('sourceShipMethod')}
              >
                CRM Shipment Method
              </th>
              <th
                onClick={() => requestSort('gpWarehouse')}
                className={getClassNamesFor('gpWarehouse')}
              >
                GP Warehouse
              </th>
              <th
                onClick={() => requestSort('rm00201Classid')}
                className={getClassNamesFor('rm00201Classid')}
              >
                Class
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, key) => (
              <tr key={key}>
                <td className="map-id">{item.id}</td>
                <td>{item.isoCountryCode}</td>
                <td>{item.gpCompanyId}</td>
                <td>{item.sourceWarehouse}</td>
                <td>{item.sourceShipMethod}</td>
                <td>{item.gpWarehouse}</td>
                <td>{item.rm00201Classid}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="map-table-2">
        <thead>
          <tr className='header-row'>
            <th
              onClick={() => requestSort('id')}
              className={`map-id ${getClassNamesFor('id')}`}
            >
              ID
            </th>
            <th
                onClick={() => requestSort('isoCurrencyCode')}
                className={getClassNamesFor('isoCurrencyCode')}
              >
                Currency
            </th>
            <th
              onClick={() => requestSort('gpCurrencyCode')}
              className={getClassNamesFor('gpCurrencyCode')}
            >
              GP Currency
            </th>
            <th
              onClick={() => requestSort('processingSequence')}
              className={getClassNamesFor('processingSequence')}
            >
              Sequence
            </th>
            <th
              onClick={() => requestSort('activatedAt')}
              className={getClassNamesFor('activatedAt')}
            >
              Activated
            </th>
            <th
              onClick={() => requestSort('deactivatedAt')}
              className={getClassNamesFor('deactivatedAt')}
            >
              Deactivated
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, key) => (
            <tr key={key}>
              <td className="map-id">{item.id}</td>
              <td>{item.isoCurrencyCode}</td>
              <td>{item.gpCurrencyCode}</td>
              <td>{item.processingSequence}</td>
              <td>
                {item.activatedAt ? item.activatedAt.split('T')[0] : 'None'}
              </td>
              <td>
                {item.deactivatedAt ? item.deactivatedAt.split('T')[0] : 'None'}
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
              onClick={() => requestSort('id')}
              className={`map-id ${getClassNamesFor('id')}`}
            >
              ID
            </th>
            <th
              onClick={() => requestSort('isoCountryCode')}
              className={getClassNamesFor('isoCountryCode')}
            >
                Country
            </th>
            <th
              onClick={() => requestSort('gpCompanyId')}
              className={getClassNamesFor('gpCompanyId')}
            >
                Company
            </th>
            <th
              onClick={() => requestSort('sourceWarehouse')}
              className={getClassNamesFor('sourceWarehouse')}
            >
              CRM Warehouse
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, key) => (
            <tr key={key}>
              <td className="map-id">{item.id}</td>
              <td>{item.isoCountryCode}</td>
              <td>{item.gpCompanyId}</td>
              <td>{item.sourceWarehouse}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className=" map-table-2">
        <thead>
          <tr className='header-row'>
            <th
              onClick={() => requestSort('id')}
              className={`map-id ${getClassNamesFor('id')}`}
            >
              ID
            </th>
            <th
              onClick={() => requestSort('sourceShipMethod')}
              className={getClassNamesFor('sourceShipMethod')}
            >
              CRM Shipment Method
            </th>
            <th
              onClick={() => requestSort('gpWarehouse')}
              className={getClassNamesFor('gpWarehouse')}
            >
              GP Warehouse
            </th>
            <th
              onClick={() => requestSort('rm00201Classid')}
              className={getClassNamesFor('rm00201Classid')}
            >
              Class
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, key) => (
            <tr key={key}>
              <td className="map-id">{item.id}</td>
              <td>{item.sourceShipMethod}</td>
              <td>{item.gpWarehouse}</td>
              <td>{item.rm00201Classid}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="map-table-3">
        <thead>
          <tr className='header-row'>
            <th
              onClick={() => requestSort('id')}
              className={`map-id ${getClassNamesFor('id')}`}
            >
              ID
            </th>
            <th
                onClick={() => requestSort('isoCurrencyCode')}
                className={getClassNamesFor('isoCurrencyCode')}
              >
                Currency
            </th>
            <th
              onClick={() => requestSort('gpCurrencyCode')}
              className={getClassNamesFor('gpCurrencyCode')}
            >
              GP Currency
            </th>
            <th
              onClick={() => requestSort('processingSequence')}
              className={getClassNamesFor('processingSequence')}
            >
              Sequence
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, key) => (
            <tr key={key}>
              <td className="map-id">{item.id}</td>
              <td>{item.isoCurrencyCode}</td>
              <td>{item.gpCurrencyCode}</td>
              <td>{item.processingSequence}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="map-table-4">
        <thead>
          <tr className='header-row'>
            <th
              onClick={() => requestSort('id')}
              className={`map-id ${getClassNamesFor('id')}`}
            >
              ID
            </th>
            <th
              onClick={() => requestSort('activatedAt')}
              className={getClassNamesFor('activatedAt')}
            >
              Activated
            </th>
            <th
              onClick={() => requestSort('deactivatedAt')}
              className={getClassNamesFor('deactivatedAt')}
            >
              Deactivated
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, key) => (
            <tr key={key}>
              <td className="map-id">{item.id}</td>
              <td>
                {item.activatedAt ? item.activatedAt.split('T')[0] : 'None'}
              </td>
              <td>
                {item.deactivatedAt ? item.deactivatedAt.split('T')[0] : 'None'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
  ) : (
    ''
  );
};

export default Map;
