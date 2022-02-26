import React from 'react';
import useSort from '../../hooks/sort-data';

const Params = props => {
  const { items, requestSort, sortConfig } = useSort(
    props.paramsData,
    'params'
  );
  const getClassNamesFor = name => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  const today = new Date().getTime();

  return props.error ? (
    <div>{props.error.message}</div>
  ) : !props.isLoaded ? (
    <div>Loading...</div>
  ) : props.path === 'config/params' ? (
    <>
      <table className="params-table">
        <thead>
          <tr className='header-row'>
            <th               
              onClick={() => requestSort('enabledDate')}
              className={getClassNamesFor('enabledDate')}
            >
              Enabled
            </th>
            <th
              onClick={() => requestSort('name')}
              className={getClassNamesFor('name')}
            >
              Name
            </th>
            <th
              onClick={() => requestSort('value')}
              className={getClassNamesFor('value')}
            >
              Value
            </th>
            <th
              onClick={() => requestSort('moduleName')}
              className={getClassNamesFor('moduleName')}
            >
              Module
            </th>
            <th
              onClick={() => requestSort('category')}
              className={getClassNamesFor('category')}
            >
              Category
            </th>
            <th
              onClick={() => requestSort('subCategory')}
              className={getClassNamesFor('subCategory')}
            >
              Sub-category
            </th>
            <th
              onClick={() => requestSort('valueType')}
              className={getClassNamesFor('valueType')}
            >
              Value Type
            </th>
            <th
              onClick={() => requestSort('notes')}
              className={getClassNamesFor('notes')}
            >
              Notes
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, key) => (
            <tr key={key}>
              {item.enabledDate ? (
                new Date(item.enabledDate).getTime() <= today ? (
                  <td className='checkmark'>&#10003;</td>
                ) : <td></td>
              ) : <td></td>}
              <td>{item.name}</td>
              <td>{item.value}</td>
              <td>{item.moduleName}</td>
              <td>{item.category}</td>
              <td>{item.subCategory}</td>
              <td>{item.valueType}</td>
              <td className='notes'>{item.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

        {items.map((item, key) => (
          <table key={key}>
            <thead className="params-table-vertical">
              <tr>
                <th>
                  Enabled
                </th>
                {item.enabledDate ? (
                  new Date(item.enabledDate).getTime() <= today ? (
                    <td className='checkmark'>&#10003;</td>
                  ) : <td>No</td>
                ) : <td>No</td>}
              </tr>
              <tr>
                <th
                  // onClick={() => requestSort('name')}
                  // className={getClassNamesFor('name')}
                >
                  Name
                </th>
                <td>{item.name}</td>
              </tr>
              <tr>
                <th
                  // onClick={() => requestSort('value')}
                  // className={getClassNamesFor('value')}
                >
                  Value
                </th>
                <td>{item.value}</td>
              </tr>
              <tr>
                <th
                  // onClick={() => requestSort('moduleName')}
                  // className={getClassNamesFor('moduleName')}
                >
                  Module
                </th>
                <td>{item.moduleName}</td>
              </tr>
              <tr>
                <th
                  // onClick={() => requestSort('category')}
                  // className={getClassNamesFor('category')}
                >
                  Category
                </th>
                <td>{item.category}</td>
              </tr>
              <tr>
                <th
                  // onClick={() => requestSort('subCategory')}
                  // className={getClassNamesFor('subCategory')}
                >
                  Sub-category
                </th>
                <td>{item.subCategory}</td>
              </tr>
              <tr>
                <th
                  // onClick={() => requestSort('valueType')}
                  // className={getClassNamesFor('valueType')}
                >
                  Value Type
                </th>
                <td>{item.valueType}</td>
              </tr>
              <tr>
                <th
                  // onClick={() => requestSort('notes')}
                  // className={getClassNamesFor('notes')}
                >
                  Notes
                </th>
                <td className='notes'>{item.notes ? item.notes : 'None'}</td>
              </tr>
            </thead>
          </table>
        )
      )
    }
  </>
  ) : (
    ''
  );
};

export default Params;
