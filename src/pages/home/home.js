import React from 'react';
import PushedOrders from './pushed/pushed-orders';
import StagedOrders from './staged/staged-orders';

const Home = () => {
  return (
    <div className='dashboard-container'>
      <PushedOrders />
      <StagedOrders />
    </div>
  );
}

export default Home;
