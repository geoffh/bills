import React from 'react';

import AddEditBillDialog from './components/addEditBill/AddEditBillDialog';
import BillAppBar from './components/appBar/BillAppBar';
import BillList from './components/billList/BillList';
import { BillService } from './services/BillService';

const addBillOkLabel = 'Add Bill';
const addBillDialogContentText = 'Fill in the details, click ' + addBillOkLabel + '.';
const addBillDialogTitle = 'Add a bill';

export default class App extends React.Component {
  constructor( inProps ) {
    super( inProps );
    this.state = { addBillVisible: false, filterBillsVisible: false }
  }

  getFilterBills = () => {
    return null;
  };

  onAddBill = ( inBill ) => {
    BillService.addBill( inBill );
    this.onCloseAddBill();
  };

  onClickAddBill = () => { this.setState( { addBillVisible: true } ); }
  onClickFilterBills = () => { this.setState( { filterBillsVisible: true } ); };
  onCloseAddBill = () => { this.setState( { addBillVisible: false } ); };

  render() {
    return (
      <div>
        <BillAppBar onClickAddBill = { this.onClickAddBill } onClickFilterBills = { this.onClickFilterBills }/>
        <BillList/>
        <AddEditBillDialog open = { this.state.addBillVisible } onCancel = { this.onCloseAddBill }
                           onClose = { this.onCloseAddBill } onOk = { this.onAddBill }
                           bill = { BillService.createBill() } categories = { BillService.getCategories() }
                           dialogTitle = { addBillDialogTitle } dialogContentText = { addBillDialogContentText } okLabel = { addBillOkLabel }/>
        { this.getFilterBills() }
      </div>
    );
  }
};