import { useState, useMemo } from 'react';

const useSort = (items, caller) => {
  if (!items) items = [];
  if (items['data'] && items['data']['failedPulls']) items = items.data.failedPulls;

  const [sortConfig, setSortConfig] = useState({
    key: caller === 'params' ? 'enabledDate' : caller === 'map' ? 'id' : caller === 'unpulled' || caller === 'unpushed' ? 'orderNumber' : caller === 'order-details' ? 'lineNumber' : null,
    direction: 'ascending',
  });

  const sortedData = useMemo(() => {
    let sortedItems = [...items];
    sortedItems.sort((a, b) => {
      let elementOne = a[sortConfig.key];
      let elementTwo = b[sortConfig.key];
      if (elementOne === null || elementOne === undefined) elementOne = '';
      if (elementTwo === null || elementTwo === undefined) elementTwo = '';
      if (typeof elementOne === 'string' && typeof elementTwo === 'string') {
        if (elementOne.toUpperCase() < elementTwo.toUpperCase())
          return sortConfig.direction === 'ascending' ? -1 : 1;
        else if (elementOne.toUpperCase() > elementTwo.toUpperCase())
          return sortConfig.direction === 'ascending' ? 1 : -1;
      } else {
        if (elementOne < elementTwo)
          return sortConfig.direction === 'ascending' ? -1 : 1;
        else if (elementOne > elementTwo)
          return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    // }
    return sortedItems;
  }, [items, sortConfig]);

  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending')
      direction = 'descending';
    setSortConfig({ key, direction });
  };

  return { items: sortedData, requestSort, sortConfig };
};

export default useSort;
