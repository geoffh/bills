import React from 'react';

import BillAddEditDialog from './components/billAddEdit/BillAddEditDialog';
import BillAppBar from './components/appBar/BillAppBar';
import BillFilter from './components/billFilter/BillFilter';
import BillList from './components/billList/BillList';
import { BillService } from './services/BillService';

const billAddOkLabel = 'Add Bill';
const billAddDialogContentText = 'Fill in the details, click ' + billAddOkLabel + '.';
const billAddDialogTitle = 'Add a bill';

export default class App extends React.Component {
  constructor( inProps ) {
    super( inProps );
    this.state = { billAddVisible: false, billFilterVisible: false }
  }

  getBillAddEditDialog = () => {
    return this.state.billAddVisible ?
      <BillAddEditDialog open onCancel = { this.onCloseBillAdd }
                        onClose = { this.onCloseBillAdd } onOk = { this.onBillAdd }
                        bill = { BillService.createBill() } categories = { BillService.getCategories() }
                        dialogTitle = { billAddDialogTitle } dialogContentText = { billAddDialogContentText } okLabel = { billAddOkLabel }/> :
    null;
  }

  onBillAdd = ( inBill ) => {
    BillService.addBill( inBill );
    this.onCloseBillAdd();
  };

  onClickBillAdd = () => { this.setState( { billAddVisible: true } ); }
  onClickBillFilter = () => { this.setState( { billFilterVisible: true } ); };
  onCloseBillAdd = () => { this.setState( { billAddVisible: false } ); };

  render() {
    return (
      <div>
        <BillAppBar onClickBillAdd = { this.onClickBillAdd } onClickBillFilter = { this.onClickBillFilter }/>
        <BillList/>
        { this.getBillAddEditDialog() }
        <BillFilter open = { this.state.billFilterVisible }/>
      </div>
    );
  }
};