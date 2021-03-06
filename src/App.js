import React from 'react';

import BillAddEditDialog from './components/billAddEdit/BillAddEditDialog';
import BillAppBar from './components/billAppBar/BillAppBar';
import BillFilter from './components/billFilter/BillFilter';
import BillList from './components/billList/BillList';
import { BillService } from './services/BillService';

const billAddOkLabel = 'Add Bill';
const billAddDialogContentText = 'Fill in the details, click ' + billAddOkLabel + '.';
const billAddDialogTitle = 'Add a bill';

export default class App extends React.Component {
  constructor( inProps ) {
    super( inProps );
    this.state = { 
      billAddVisible: false, 
      billFilterVisible: false,
      filters: {
        range: this.createInitialRange(),
        categories: [],
        billers: []
      }    
    };
    this.refreshCategories();
    BillService.addCategoryListener( this.refreshCategories );
    this.refreshBillers();
    BillService.addBillerListener( this.refreshBillers );
  }

  componentWillUnmount() {
    BillService.removeBillerListener( this.refreshBillers );
    BillService.removeCategoryListener( this.refreshCategories );
  }

  createInitialRange = () => {
    const theStartDate = new Date();
    theStartDate.setMonth( theStartDate.getMonth() - 2 );
    const theEndDate = new Date();
    theEndDate.setMonth( theEndDate.getMonth() + 2 );
    return { startDate: theStartDate, endDate: theEndDate }
  };

  getBillAddEditDialog = () => {
    return this.state.billAddVisible ?
      <BillAddEditDialog open onCancel = { this.onCloseBillAdd }
                        onClose = { this.onCloseBillAdd } onOk = { this.onBillAdd }
                        bill = { BillService.createBill() } categories = { this.categories }
                        dialogTitle = { billAddDialogTitle } dialogContentText = { billAddDialogContentText } okLabel = { billAddOkLabel }/> :
    null;
  }

  getFilters = () => {
    const theFilters = this.state.filters;
    let theBillers = theFilters.billers;
    if ( theBillers && theBillers.length === this.billers.length ) {
      theBillers = null;
    }
    let theCategories = theFilters.categories;
    if ( theCategories && theCategories.length === this.categories.length ) {
      theCategories = null;
    }
    return {
      range: this.state.filters.range, billers: theBillers, categories: theCategories
    }
  }

  onBillAdd = ( inBill ) => {
    BillService.addBill( inBill );
    this.onCloseBillAdd();
  };

  onChangeRange = inRange => {
    const theFilters = this.state.filters;
    theFilters.range = inRange;
    this.setState( { filters: theFilters } );
  };

  onClickBillAdd = () => { this.setState( { billAddVisible: true } ); }
  onClickBillFilter = () => { this.setState( { billFilterVisible: true } ); };
  onCloseBillAdd = () => { this.setState( { billAddVisible: false } ); };
  onCloseBillFilter = () => { this.setState( { billFilterVisible: false } ); };

  onSelectAllBillers = inEvent => this.onSelectAllFilterItems( this.billers, 'billers', inEvent );
  onSelectAllCategories = inEvent => this.onSelectAllFilterItems( this.categories, 'categories', inEvent );
  onSelectAllFilterItems = ( inItems, inSelectedItemsPropName, inEvent ) => {
    const theFilters = this.state.filters;
    theFilters[ inSelectedItemsPropName ] = inEvent.target.checked ? inItems.slice() : [];
    this.setState( { filters: theFilters } );
  };

  onSelectBiller = inEvent => this.onSelectFilterItem( 'billers', inEvent );
  onSelectCategory = inEvent => this.onSelectFilterItem( 'categories', inEvent );
  onSelectFilterItem = ( inSelectedItemsPropName, inEvent ) => {
    const theSelectedItems = this.state.filters[ inSelectedItemsPropName ];
    if ( inEvent.target.checked ) {
      theSelectedItems.push( inEvent.target.name ); 
    } else {
      theSelectedItems.splice( theSelectedItems.indexOf( inEvent.target.name ), 1 );
    }
    const theFilters = this.state.filters;
    theFilters[ inSelectedItemsPropName ] = theSelectedItems;
    this.setState( { filters: theFilters } );
  };

  refreshBillers = () => { this.billers = BillService.getBillers(); }
  refreshCategories = () => { this.categories = BillService.getCategories(); }

  render() {
    const theRange = {
      startDate: this.state.filters.range.startDate,
      endDate: this.state.filters.range.endDate,
      onChangeRange: this.onChangeRange
    };
    const theCategories = {
      categories: this.categories, selectedCategories: this.state.filters.categories,
      onSelectCategory: this.onSelectCategory, onSelectAllCategories: this.onSelectAllCategories
    };
    const theBillers = {
      billers: this.billers, selectedBillers: this.state.filters.billers,
      onSelectBiller: this.onSelectBiller, onSelectAllBillers: this.onSelectAllBillers
    };
    return (
      <div>
        <BillAppBar onClickBillAdd = { this.onClickBillAdd } onClickBillFilter = { this.onClickBillFilter }/>
        <BillList filters = { this.getFilters() }/>
        { this.getBillAddEditDialog() }
        <BillFilter open = { this.state.billFilterVisible } onClose = { this.onCloseBillFilter }
                    range = { theRange } categories = { theCategories } billers = { theBillers }/>
      </div>
    );
  }
};