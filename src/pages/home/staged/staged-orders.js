import React from 'react';
import Api from './api-call';

const StagedOrders = () => (
  <>
    <h3>Orders Staged for Push to GP</h3>
    <div className='dash-staged'>
      <Api path={'StagingOrders/summary/0/-1'} subheader={'Unpushed'} />
      <Api path={'StagingOrders/summary/2/-1'} subheader={'Push Failed'} />
      <Api path={'StagingOrders/summary/3/-1'} subheader={'Push Ignored'} />
    </div>
  </>
);

export default StagedOrders;
