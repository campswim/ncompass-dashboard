import axios from 'axios';

export default async function logChange(table, column, value, user = 'admin') {  
  if (!column || !value) return;

  const queryString = 'query logChange($table: String!, $column: String!, $value: String!, $user: String!) {logChange(table: $table, column: $column, value: $value, user: $user) {TableName, ColumnName Value, User}}';
  
  const graphQlQuery = {
    operation: 'logChange',
    query: queryString,
    variables: {
      table,
      column,
      value,
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
    res => { return res.data },
    err => { console.error({err}) }
  );
}
