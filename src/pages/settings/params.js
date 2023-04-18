import React, { useState, useEffect } from 'react';
import useSort from '../../hooks/sort-data';
import axios from 'axios';

const Params = props => {
  const [newValue, setNewValue] = useState({});
  let { items, requestSort, sortConfig } = useSort(props.paramsData.params, 'params');
  const today = new Date().getTime();
  
  const getClassNamesFor = name => {
    if (!sortConfig) return;
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  const handleChange = (id, column, event) => {
      const prevValue = event.target.dataset.defaultValue ? event.target.dataset.defaultValue : '';
      const newValue = event.target.textContent ? event.target.textContent : '';

      if (prevValue && newValue && prevValue !== newValue) setNewValue({ id, column, prevValue, newValue });
  };

  useEffect(() => {
    if (props.path === 'params' && JSON.stringify(newValue) !== '{}') {
      const queryString = `mutation ${props.path}Update($id: ID!, $column: String!, $prevValue: String!, $newValue: String!) {${props.path}Update(id: $id, column: $column, prevValue: $prevValue, newValue: $newValue) {Name${newValue.column !== 'Name' ? ' ' + newValue.column : '' }}}`;
      const graphQlQuery = {
        operation: `${props.path}Update`,
        query: queryString,
        variables: {
          id: newValue.id,
          column: newValue.column,
          prevValue: newValue.prevValue,
          newValue: newValue.newValue
        }
      };
      const options = {
        method: 'POST',
        url: process.env.REACT_APP_API,
        data: JSON.stringify(graphQlQuery),
        headers: {'Content-Type': 'application/json'}
      };
  
      axios.request(options).then(
        res => {
          const response = res.data.data.paramsUpdate ? res.data.data.paramsUpdate.Name : '';
          if (response && response === newValue.newValue) props.reCallApi('params');
        },
        err => { console.error({err}) }
      );
    }

  }, [props, newValue]);
  
  return props.path === 'params' ? (
    <>
      <table className="params-table">
        <thead>
          <tr className='header-row'>
            <th               
              onClick={() => requestSort('EnabledDate')}
              className={getClassNamesFor('EnabledDate')}
            >
              Enabled
            </th>
            <th
              onClick={() => requestSort('Name')}
              className={getClassNamesFor('Name')}
            >
              Name
            </th>
            <th
              onClick={() => requestSort('Value')}
              className={getClassNamesFor('Value')}
            >
              Value
            </th>
            <th
              onClick={() => requestSort('ModuleId')}
              className={getClassNamesFor('ModuleId')}
            >
              Module ID
            </th>
            <th
              onClick={() => requestSort('Category')}
              className={getClassNamesFor('Category')}
            >
              Category
            </th>
            <th
              onClick={() => requestSort('SubCategory')}
              className={getClassNamesFor('SubCategory')}
            >
              Sub-Category
            </th>
            <th
              onClick={() => requestSort('ValueType')}
              className={getClassNamesFor('ValueType')}
            >
              Value Type
            </th>
            <th
              onClick={() => requestSort('Notes')}
              className={getClassNamesFor('Notes')}
            >
              Notes
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, key) => (
            <tr key={key}>
                {item.EnabledDate ? (
                  new Date(parseInt(item.EnabledDate)).getTime() <= today ? (
                    <td className='checkmark'>&#10003;</td>
                  ) : <td></td>
                ) : <td></td>}
                <td 
                  contentEditable="true" 
                  suppressContentEditableWarning="true" 
                  data-default-value={item.Name} 
                  onBlur={(e) => handleChange(item.Name, 'Name', e)}>{item.Name}
                </td>
                {item.Value && item.Value.includes('|') ? (
                  <td>{item.Value.split('\n').map(val => {
                    const setting = val.split('|');
                    const key = setting[0];
                    let value = setting[1];
                    let result;
                    if (value && value.includes('~')) value = value.replace('~', ', ');                  
                    if (value) value = value.trimEnd();
                    if (value && value[value.length - 1] === ',') value = value.substring(0, value.length - 1);
                    result = key && value ? `${key}: ${value}\n` : '';
                    return result;
                  })}</td>
                ) : (
                  <td>{item.Value}</td>
                )}
                <td>{item.ModuleId}</td>
                <td>{item.Category}</td>
                <td>{item.SubCategory}</td>
                <td>{item.ValueType}</td>
                <td className='notes'>{item.Notes}</td>
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
                {item.EnabledDate ? (
                  new Date(item.EnabledDate).getTime() <= today ? (
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
                <td>{item.Name}</td>
              </tr>
              <tr>
                <th
                  // onClick={() => requestSort('value')}
                  // className={getClassNamesFor('value')}
                >
                  Value
                </th>
                <td>{item.Value}</td>
              </tr>
              <tr>
                <th
                  // onClick={() => requestSort('ModuleId')}
                  // className={getClassNamesFor('ModuleId')}
                >
                  Module
                </th>
                <td>{item.ModuleId}</td>
              </tr>
              <tr>
                <th
                  // onClick={() => requestSort('Category')}
                  // className={getClassNamesFor('Category')}
                >
                  Category
                </th>
                <td>{item.Category}</td>
              </tr>
              <tr>
                <th
                  // onClick={() => requestSort('SubCategory')}
                  // className={getClassNamesFor('SubCategory')}
                >
                  Sub-Category
                </th>
                <td>{item.SubCategory}</td>
              </tr>
              <tr>
                <th
                  // onClick={() => requestSort('ValueType')}
                  // className={getClassNamesFor('ValueType')}
                >
                  Value Type
                </th>
                <td>{item.ValueType}</td>
              </tr>
              <tr>
                <th
                  // onClick={() => requestSort('notes')}
                  // className={getClassNamesFor('notes')}
                >
                  Notes
                </th>
                <td className='notes'>{item.Notes ? item.Notes : 'None'}</td>
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
