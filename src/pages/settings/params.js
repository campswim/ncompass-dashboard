import React, { useState, useEffect, useCallback, useRef } from 'react';
import useSort from '../../hooks/sort-data';
import getType from '../../hooks/get-type';
import selectElementContents from '../../hooks/select-all';
import logChange from '../../hooks/log-change';
import axios from 'axios';

const Params = props => {
  const [newValue, setNewValue] = useState({});
  const dataType = useRef({}); // => dataType.current = {ColumnName, DataType, MaxLength}
  let { items, requestSort, sortConfig } = useSort(props.paramsData.params, 'params');
  const error = items && items.length === 1 && items[0].Error ? items[0].Error : '';
  const today = new Date().getTime();

  const getClassNamesFor = useCallback(name => {
    if (!sortConfig) return;
    let className = 'Name' !== name ? 'header-editable' : '';
    className = sortConfig.key === name ? sortConfig.direction + ' ' + className : className;
    return className ? className : undefined;
  }, [sortConfig]);

  const handleClick = (event, row, column, id) => {
    let currentValue = event.textContent;
    let defaultValue = event.dataset.defaultValue, element;
    const vpWidth = window.innerWidth;

    if ('✓' === defaultValue) {
      if (vpWidth >= 528) element = document.getElementById(`checkmark-${row}`);
      else element = document.getElementById(`mobile-checkmark-${row}`);
    } else {
      if (vpWidth >= 528) element = document.getElementById(`${defaultValue}-${row}`);
      else element = document.getElementById(`mobile-${defaultValue}-${row}`);
    }
    
    selectElementContents(element); // Selects all content in the field.
        
    if ('Name' !== column) { // Editing the Name column is not allowed, it being the PK in the db table.
      if (defaultValue !== currentValue) { // Replace errors in entries with the previous text; also, check unchecked boxes for the DateEnabled field.
        element.textContent = defaultValue;
        element.removeAttribute('style');
      } else {
        if ('EnabledDate' !== column) element.setAttribute('contentEditable', 'true');
        else element.textContent = 'No';
      }
    }

    if ('EnabledDate' === column) { // Update the EnabledDate in the db with today's date/time (in YYYY-MM-DD HH:MM:SS).
      currentValue = 'No' === currentValue ? new Date().toISOString() : 'disable';
      defaultValue = 'disable' || 'No' === currentValue ? `checkmark-${row}` : defaultValue;
      setNewValue({ id, row, column, prevValue: defaultValue, newValue: currentValue });
    }
  }

  // Handle user edits.
  const handleBlur = (id, row, column, event) => {
    const prevValue = event.target.dataset.defaultValue ? event.target.dataset.defaultValue : '';
    const newValue = event.target.textContent ? event.target.textContent : '';
    const table = 'AppParams';
    const typeMap = {
      bool: 'boolean',
      int: 'number',
      long: 'bigint',
      byte: 'number',
      float: 'number',
      double: 'number',
      decimal: 'number',
      DateTime: 'object',
      char: 'string',
      varchar: 'string',
      object: 'object',
      string: 'string',
      JSON: 'object',
      XML: 'string'
    };
    const vpWidth = window.innerWidth;
    const element = vpWidth >= 528 ? document.getElementById(`${prevValue}-${row}`) : document.getElementById(`mobile-${prevValue}-${row}`);

    if (prevValue === newValue) {
      element.removeAttribute('contentEditable');
      return;
    }

    // Get the column's configuration from the DB.
    if (table && column) {
      getType(table, column).then(response => {
        dataType.current = response.data.getType;

        // Check the input against type and length.
        if (JSON.stringify(dataType.current) !== '{}') {
          if (newValue) {
            const columnName = dataType.current.ColumnName;
            if (columnName === column) {
              const type = typeMap[dataType.current.DataType];
              let typeNewValue = columnName === 'ValueType' ? parseInt(newValue) : newValue;
              typeNewValue = typeNewValue.isNaN ? typeNewValue : typeof typeNewValue;
 
              if (type === typeNewValue) {
                if (dataType.current.MaxLength > newValue.length || !dataType.current.MaxLength) {
                  if (prevValue !== newValue) {
                    if (!/<\/?[a-z][\s\S]*>/i.test(newValue)) { // Check that no html is being introduced.
                      setNewValue({ id, row, column, prevValue, newValue: newValue });
                      element.textContent = newValue;
                    } else {
                      element.setAttribute('style', 'color: red');
                      element.textContent = 'There is html in the new value. Please revise your input and resubmit.';
                      element.scrollIntoViewIfNeeded({behavior:'smooth', inline:'start'});
                      // setTimeout(() => {
                      //   element.textContent = prevValue;
                      //   element.removeAttribute('style');
                      // }, 5000);
                    }
                  } 
                }
              } else {
                element.setAttribute('style', 'color: red');
                element.textContent = `The new value's datatype (${typeof newValue}) doesn't match the databases's data type (${type}).`;
                element.scrollIntoViewIfNeeded({behavior:'smooth', inline:'start'});
              }
            }
          } else {
            element.textContent = prevValue;
          }
        }
      });
    }
  };

  useEffect(() => {
    const vpWidth = window.innerWidth;
    const element = document.getElementById(`${newValue.prevValue}-${newValue.row}`);
    const mobileElement = document.getElementById(`mobile-${newValue.prevValue}-${newValue.row}`);
    let newElement;

    if (props.path === 'params' && JSON.stringify(newValue) !== '{}') {
      const queryString = `mutation ${props.path}Update($id: ID!, $column: String!, $prevValue: String!, $newValue: String!) {${props.path}Update(id: $id, column: $column, prevValue: $prevValue, newValue: $newValue) {Error {name code message} Name${newValue.column !== 'Name' ? ' ' + newValue.column : '' }}}`;
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
          let response = res.data.data.paramsUpdate ? res.data.data.paramsUpdate[newValue.column] : '';
          const error = res.data.data.paramsUpdate ? res.data.data.paramsUpdate.Error : '';

          if (typeof response === 'number') response = JSON.stringify(response);

          if (response && response === newValue.newValue) {
            if (element || mobileElement) {
              const newId = `${newValue.newValue}-${newValue.row}`;
              const newMobileId = `mobile-${newValue.newValue}-${newValue.row}`;
              element.removeAttribute('contentEditable');
              mobileElement.removeAttribute('contentEditable');
              element.textContent = newValue.newValue;
              mobileElement.textContent = newValue.newValue;
              element.setAttribute('id', newId);
              mobileElement.setAttribute('id', newMobileId);
              element.setAttribute('data-default-value', newValue.newValue);
              mobileElement.setAttribute('data-default-value', newValue.newValue);
              items[newValue.row][newValue.column] = newValue.newValue;
              // requestSort(newValue.column, getClassNamesFor(newValue.column)); // The re-sort works, but I can't figure out how to get the updated item after the re-sort.
              newElement = vpWidth >= 528 ? document.getElementById(`${newValue.newValue}-${newValue.row}`) : document.getElementById(`mobile-${newValue.newValue}-${newValue.row}`);

              if (newElement) { // Scroll the edited element into view to communicate to the user that the change was accepted.
                newElement.scrollIntoViewIfNeeded({behavior:'smooth', inline:'start'});
                newElement.classList.toggle('edited');
                setTimeout(() => { newElement.classList.toggle('re-sorted'); }, 3000);
                setTimeout(() => {
                  newElement.classList.toggle('edited');
                  newElement.classList.toggle('re-sorted');
                }, 6000);
              }

              // Log the change to the database.
              const user = 'admin'; // There's no authentication yet built into this app.
              logChange('AppParams', newValue.ColumnName, newValue.newValue, user);
            }
          } else if (error && null !== error.message) {
            element.textContent = error.message + ' Please correct your input.';
            element.setAttribute('style', 'color:red');
          }
        },
        err => { console.error({err}) }
      );
    }

    // Add instructions to the table headers to be displayed on hover.
    // const parentElement = document.getElementsByClassName('header-editable');
    // if (parentElement) {
    //   for (const el of parentElement) {
    //     const html = el.innerHTML;
    //     if (!html.includes('<span>')) {
    //       if (vpWidth >= 528) el.innerHTML = html + '<span>Double-click in any of this column\'s fields to edit its contents.</span>';
    //       else el.innerHTML = html + '<span>Tap on this field\'s value to highlight and change it.';
    //     }
    //   }
    // }

  }, [props, newValue, items, requestSort, getClassNamesFor]);
  
  return props.path === 'params' ?
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
                {/* <th
                  onClick={() => requestSort('ModuleId')}
                  className={getClassNamesFor('ModuleId')}
                >
                  Module ID
                </th> */}
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
                  {item.EnabledDate ? 
                    (
                      new Date(parseInt(item.EnabledDate)).getTime() <= today ? 
                      (
                        <td 
                          className="checkmark editable"
                          suppressContentEditableWarning="true" 
                          data-default-value="&#10003;"
                          id={`checkmark-${key}`}
                          onBlur={(e) => handleBlur(item.Name, key, 'EnabledDate', e)} // params: id, row, column, event
                          onClick={(e) => handleClick(e.target, key, 'EnabledDate', item.Name, )} // params: event, row, column, id
                        >
                          &#10003;
                        </td>
                      ) : (
                        <td
                          className="checkmark editable"
                          suppressContentEditableWarning="true" 
                          data-default-value="&#10003;"
                          id={`checkmark-${key}`}
                          onBlur={(e) => handleBlur(item.Name, key, 'EnabledDate', e)} // params: id, row, column, event
                          onClick={(e) => handleClick(e.target, key, 'EnabledDate', item.Name, )} // params: event, row, column, id
                        >No</td>
                      )
                    ) : (
                      <td
                        className="checkmark editable"
                        suppressContentEditableWarning="true" 
                        data-default-value="&#10003;"
                        id={`checkmark-${key}`}
                        onBlur={(e) => handleBlur(item.Name, key, 'EnabledDate', e)} // params: id, row, column, event
                        onClick={(e) => handleClick(e.target, key, 'EnabledDate', item.Name, )} // params: event, row, column, id
                      >No</td>
                    )
                  }
                  <td>{item.Name}</td>
                  {item.Value && item.Value.includes('|') ? 
                    (
                      <td
                        className="editable"
                        suppressContentEditableWarning="true" 
                        data-default-value={item.Value.split('\n').map(val => {
                          const setting = val.split('|');
                          const key = setting[0];
                          let value = setting[1], result;
                          if (value && value.includes('~')) value = value.replace('~', ', ');                  
                          if (value) value = value.trimEnd();
                          if (value && value[value.length - 1] === ',') value = value.substring(0, value.length - 1);
                          result = key && value ? `${key}: ${value}\n` : '';
                          return result;
                        })}
                        id={`${item.Value}-${key}`}
                        onBlur={(e) => handleBlur(item.Name, key, 'Value', e)}
                        onClick={(e) => handleClick(e.target, key, 'Value', item.Name)}
                      >{item.Value.split('\n').map(val => {
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
                      <td
                        className="editable"
                        suppressContentEditableWarning="true" 
                        data-default-value={item.Value}
                        id={`${item.Value}-${key}`}
                        onBlur={(e) => handleBlur(item.Name, key, 'Value', e)}
                        onClick={(e) => handleClick(e.target, key, 'Value', item.Name)}
                      >{item.Value}
                      </td>
                    )
                  }
                  {/* <td>{item.ModuleId}</td> */}
                  <td
                    className="editable"
                    suppressContentEditableWarning="true" 
                    data-default-value={item.Category}
                    id={`${item.Category}-${key}`}
                    onBlur={(e) => handleBlur(item.Name, key, 'Category', e)}
                    onClick={(e) => handleClick(e.target, key, 'Category', item.Name)}
                  >{item.Category}</td>
                  <td
                    className="editable"
                    suppressContentEditableWarning="true" 
                    data-default-value={item.SubCategory}
                    id={`${item.SubCategory}-${key}`}
                    onBlur={(e) => handleBlur(item.Name, key, 'SubCategory', e)}
                    onClick={(e) => handleClick(e.target, key, 'SubCategory', item.Name)}                  
                  >{item.SubCategory}</td>
                  <td
                    className="editable"
                    suppressContentEditableWarning="true" 
                    data-default-value={item.ValueType}
                    id={`${item.ValueType}-${key}`}
                    onBlur={(e) => handleBlur(item.Name, key, 'ValueType', e)}
                    onClick={(e) => handleClick(e.target, key, 'ValueType', item.Name)}                  
                  >
                    {item.ValueType}
                  </td>
                  <td 
                    className="notes editable"
                    suppressContentEditableWarning="true" 
                    data-default-value={item.Notes}
                    id={`${item.Notes}-${key}`}
                    onBlur={(e) => handleBlur(item.Name, key, 'Notes', e)}
                    onClick={(e) => handleClick(e.target, key, 'Notes', item.Name)}                  
                  >
                    {item.Notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          { /* Display the table vertically for mobile. */ }
          {items.map((item, key) => (
            <table key={key}>
              <thead className="params-table-vertical">
                <tr>
                  <th className={getClassNamesFor('EnabledDate')}>
                    Enabled
                  </th>
                  {
                    item.EnabledDate ? 
                    (
                      new Date(parseInt(item.EnabledDate)).getTime() <= today ? (
                        <td 
                          className="checkmark editable"
                          suppressContentEditableWarning="true" 
                          data-default-value="&#10003;"
                          id={`mobile-checkmark-${key}`}
                          onBlur={(e) => handleBlur(item.Name, key, 'EnabledDate', e)} // params: id, row, column, event
                          onClick={(e) => handleClick(e.target, key, 'EnabledDate', item.Name, )} // params: event, row, column, id
                        >
                          &#10003;
                        </td>
                      ) : (
                        <td
                          className="checkmark editable"
                          suppressContentEditableWarning="true" 
                          data-default-value="&#10003;"
                          id={`mobile-checkmark-${key}`}
                          onBlur={(e) => handleBlur(item.Name, key, 'EnabledDate', e)} // params: id, row, column, event
                          onClick={(e) => handleClick(e.target, key, 'EnabledDate', item.Name, )} // params: event, row, column, id
                        >No</td>
                      )
                    ) : (
                      <td
                        className="checkmark editable"
                        suppressContentEditableWarning="true" 
                        data-default-value="&#10003;"
                        id={`mobile-checkmark-${key}`}
                        onBlur={(e) => handleBlur(item.Name, key, 'EnabledDate', e)} // params: id, row, column, event
                        onClick={(e) => handleClick(e.target, key, 'EnabledDate', item.Name, )} // params: event, row, column, id
                      >No</td>
                    )
                  }
                </tr>
                <tr><th>Name</th><td>{item.Name}</td></tr>
                <tr>
                  <th className={getClassNamesFor('Value')}>Value</th>
                  {item.Value && item.Value.includes('|') ? 
                    (
                      <td
                        className="editable"
                        suppressContentEditableWarning="true" 
                        data-default-value={item.Value.split('\n').map(val => {
                          const setting = val.split('|');
                          const key = setting[0];
                          let value = setting[1];
                          let result;
                          if (value && value.includes('~')) value = value.replace('~', ', ');                  
                          if (value) value = value.trimEnd();
                          if (value && value[value.length - 1] === ',') value = value.substring(0, value.length - 1);
                          result = key && value ? `${key}: ${value}\n` : '';
                          return result;
                        })}
                        id={`mobile-${item.Value}-${key}`}
                        onBlur={(e) => handleBlur(item.Name, key, 'Value', e)}
                        onClick={(e) => handleClick(e.target, key, 'Value', item.Name)}
                      >{item.Value.split('\n').map(val => {
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
                      <td
                        className="editable"
                        suppressContentEditableWarning="true" 
                        data-default-value={item.Value}
                        id={`mobile-${item.Value}-${key}`}
                        onBlur={(e) => handleBlur(item.Name, key, 'Value', e)}
                        onClick={(e) => handleClick(e.target, key, 'Value', item.Name)}
                      >{item.Value}</td>
                    )
                  }
                </tr>
                {/* <tr><th className={getClassNamesFor('ModuleId')}>Module</th><td>{item.ModuleId}</td></tr> */}
                <tr>
                  <th className={getClassNamesFor('Category')}>Category</th>
                  <td
                    className="editable"
                    suppressContentEditableWarning="true" 
                    data-default-value={item.Category}
                    id={`mobile-${item.Category}-${key}`}
                    onBlur={(e) => handleBlur(item.Name, key, 'Category', e)}
                    onClick={(e) => handleClick(e.target, key, 'Category', item.Name)}
                  >
                    {item.Category}
                  </td>
                </tr>
                <tr>
                  <th className={getClassNamesFor('SubCategory')}>Sub-Category</th>
                  <td
                    className="editable"
                    suppressContentEditableWarning="true" 
                    data-default-value={item.SubCategory}
                    id={`mobile-${item.SubCategory}-${key}`}
                    onBlur={(e) => handleBlur(item.Name, key, 'SubCategory', e)}
                    onClick={(e) => handleClick(e.target, key, 'SubCategory', item.Name)}                  
                  >
                    {item.SubCategory}
                  </td>
                </tr>
                <tr>
                  <th className={getClassNamesFor('ValueType')}>Value Type</th>
                  <td
                    className="editable"
                    suppressContentEditableWarning="true" 
                    data-default-value={item.ValueType}
                    id={`mobile-${item.ValueType}-${key}`}
                    onBlur={(e) => handleBlur(item.Name, key, 'ValueType', e)}
                    onClick={(e) => handleClick(e.target, key, 'ValueType', item.Name)}                  
                  >
                    {item.ValueType}
                  </td>
                </tr>
                <tr>
                  <th className={getClassNamesFor('Notes')}>Notes</th>
                  <td 
                    className="notes editable"
                    suppressContentEditableWarning="true" 
                    data-default-value={item.Notes}
                    id={`mobile-${item.Notes}-${key}`}
                    onBlur={(e) => handleBlur(item.Name, key, 'Notes', e)}
                    onClick={(e) => handleClick(e.target, key, 'Notes', item.Name)}                  
                  >
                    {item.Notes ? item.Notes : 'None'}
                  </td>
                </tr>
              </thead>
            </table>
          ))}
        </>
      ) 
    ) : (
      ''
  )
};

export default Params;
