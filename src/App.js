import React, { useEffect, useState } from 'react'

import BillAddEditDialog from './components/billAddEdit/BillAddEditDialog'
import BillAppBar from './components/billAppBar/BillAppBar'
import BillFilter from './components/billFilter/BillFilter'
import BillList from './components/billList/BillList'
import BillService from './services/BillService'

const billAddOkLabel = 'Add Bill'
const billAddDialogContentText = 'Fill in the details, click ' + billAddOkLabel + '.'
const billAddDialogTitle = 'Add a bill'

export default function App( props ) {
  const [ billAddVisible, setBillAddVisible ] = useState( false )
  const [ billFilterVisible, setBillFilterVisible ] = useState( false )
  const [ filters, setFilters ] = useState( {
    range: createInitialRange(),
    categories: [],
    billers: []
  } )
  let billers
  let categories

  refreshCategories()
  refreshBillers()

  useEffect( () => {
    BillService.addCategoryListener( refreshCategories )
    BillService.addBillerListener( refreshBillers )
    return () => {
      BillService.removeCategoryListener( refreshCategories )
      BillService.removeBillerListener( refreshBillers )
    }
    // eslint-disable-next-line
  }, [] )

  function createInitialRange() {
    const theStartDate = new Date()
    theStartDate.setMonth( theStartDate.getMonth() - 2 )
    const theEndDate = new Date()
    theEndDate.setMonth( theEndDate.getMonth() + 2 )
    return { startDate: theStartDate, endDate: theEndDate }
  }

  function getBillAddEditDialog() {
    return billAddVisible ?
      <BillAddEditDialog open onCancel = { onCloseBillAdd }
                        onClose = { onCloseBillAdd } onOk = { onBillAdd }
                        bill = { BillService.createBill() } categories = { categories }
                        dialogTitle = { billAddDialogTitle } dialogContentText = { billAddDialogContentText } okLabel = { billAddOkLabel }/> :
      null
  }

  function getFilters() {
    const theFilters = filters
    let theBillers = theFilters.billers
    if ( theBillers && theBillers.length === billers.length ) {
      theBillers = null
    }
    let theCategories = theFilters.categories
    if ( theCategories && theCategories.length === categories.length ) {
      theCategories = null
    }
    return {
      range: filters.range, billers: theBillers, categories: theCategories
    }
  }

  function onBillAdd( inBill ) {
    BillService.addBill( inBill )
    onCloseBillAdd()
  }

  function onChangeRange( inRange ) {
    filters.range = inRange
    setFilters( { ...filters } )
  }

  function onClickBillAdd() { setBillAddVisible( true ) }
  function onClickBillFilter() { setBillFilterVisible( true ) }
  function onCloseBillAdd() { setBillAddVisible( false ) }
  function onCloseBillFilter() { setBillFilterVisible( false ) }

  function onSelectAllBillers( inEvent ) { onSelectAllFilterItems( billers, 'billers', inEvent ) }
  function onSelectAllCategories( inEvent ) { onSelectAllFilterItems( categories, 'categories', inEvent ) }
  function onSelectAllFilterItems( inItems, inSelectedItemsPropName, inEvent ) {
    filters[ inSelectedItemsPropName ] = inEvent.target.checked ? inItems.slice() : []
    setFilters( { ...filters } )
  }

  function onSelectBiller( inEvent ) { onSelectFilterItem( 'billers', inEvent ) }
  function onSelectCategory( inEvent ) { onSelectFilterItem( 'categories', inEvent ) }
  function onSelectFilterItem( inSelectedItemsPropName, inEvent ) {
    if ( inEvent.target.checked ) {
      filters[ inSelectedItemsPropName ].push( inEvent.target.name ) 
    } else {
      filters[ inSelectedItemsPropName ].splice( filters[ inSelectedItemsPropName ].indexOf( inEvent.target.name ), 1 )
    }
    setFilters( { ...filters } )
  }

  function refreshBillers() { billers = BillService.getBillers() }
  function refreshCategories() { categories = BillService.getCategories() }

  const theRange = {
    startDate: filters.range.startDate,
    endDate: filters.range.endDate,
    onChangeRange: onChangeRange
  }
  const theCategories = {
    categories: categories, selectedCategories: filters.categories,
    onSelectCategory: onSelectCategory, onSelectAllCategories: onSelectAllCategories
  }
  const theBillers = {
    billers: billers, selectedBillers: filters.billers,
    onSelectBiller: onSelectBiller, onSelectAllBillers: onSelectAllBillers
  }
  return (
    <div>
      <BillAppBar onClickBillAdd = { onClickBillAdd } onClickBillFilter = { onClickBillFilter }/>
      <BillList filters = { getFilters() }/>
      { getBillAddEditDialog() }
      <BillFilter open = { billFilterVisible } onClose = { onCloseBillFilter }
                  range = { theRange } categories = { theCategories } billers = { theBillers }/>
    </div>
  )
}