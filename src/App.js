import React from 'react';

import BillAppBar from './components/BillAppBar';
import BillList from './components/BillList';

export default function App() {  
  return (
    <div>
      <BillAppBar/>
      <BillList/>
    </div>
  );
};