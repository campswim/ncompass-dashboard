import axios from 'axios';

export default async function getType(table, column) {
  if (!column) return;
  const queryString = 'query getType($table: String!, $column: String!) {getType(table: $table, column: $column) {ColumnName DataType MaxLength}}';
  const graphQlQuery = {
    operation: 'getType',
    query: queryString,
    variables: {
      table,
      column
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
