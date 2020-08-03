import React from 'react';

import BillAppBar from './components/appBar/BillAppBar';
import BillList from './components/billList/BillList';

export default function App() {  
  return (
    <div>
      <BillAppBar/>
      <BillList/>
    </div>
  );
};