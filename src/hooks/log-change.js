import axios from 'axios';

export default async function logChange(table, column, row, prevValue, newValue, dataType, user = '') {
  if (!column || !newValue) return;

  const queryString = 'query logChange($table: String!, $column: String!, $row: String!, $prevValue: String!, $newValue: String!, $dataType: Int!, $user: String!) {logChange(table: $table, column: $column, row: $row, prevValue: $prevValue, newValue: $newValue, dataType: $dataType, user: $user) {Id, TableName, ColumnName, PrevValue, NewValue, DataType, User, DateTime}}';
  
  const graphQlQuery = {
    operation: 'logChange',
    query: queryString,
    variables: {
      table,
      column,
      row,
      prevValue,
      newValue,
      dataType,
      user
    }
  };
  const options = {
    method: 'POST',
    url: process.env.REACT_APP_API,
    data: JSON.stringify(graphQlQuery),
    headers: {'Content-Type': 'application/json'}
  };

  return await axios.request(options).then(
    res => {  
      return res.data 
    },
    err => { console.error({err}) }
  );
}
