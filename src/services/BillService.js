import { v4 as uuid } from 'uuid'

import BillSortService from './BillSortService';
import RepeatRuleService from './RepeatRuleService'

const BillService = ( function() {
  const { localStorage } = window
  const editDeleteOptionThisOccurence = 1
  const editDeleteOptionThisAndFutureOccurences = 2
  const editDeleteOptionAllOccurrences = 3
  const editDeleteOptionItems = [
    { value: editDeleteOptionThisOccurence, label: "This bill"},
    { value: editDeleteOptionThisAndFutureOccurences, label: "This and all future bills"},
    { value: editDeleteOptionAllOccurrences, label: "All bills"}
  ]
  const billListeners = []
  const billerListeners = []
  const categoryListeners = []

  function addBill( inBill ) {
    const theBills = getBills()
    theBills.push( inBill )
    setBills( theBills )
    addCategoriesFromBill( inBill )
    addBillerFromBill( inBill )
    notifyBillListeners()
  }

  function addBiller( inBiller ) {
    if ( inBiller ) {
      const theBillers = getBillers()
      if ( ! theBillers.includes( inBiller ) ) {
        theBillers.push( inBiller )
        setBillers( theBillers )
        notifyBillerListeners()
      }
    }
  }

  function addBillerFromBill( inBill ) { addBiller( inBill.biller ) }

  function addCategory( inCategory ) {
    if ( inCategory ) {
      const theCategories = getCategories()
      if ( ! theCategories.includes( inCategory ) ) {
        theCategories.push( inCategory )
        setCategories( theCategories )
        notifyCategoryListeners()
      }
    }
  }

  function addCategoriesFromBill( inBill ) {
    if ( inBill.categories ) {
      inBill.categories.forEach( inCategory => addCategory( inCategory ) )
    }
  }

  function addBillListener( inListener ) { billListeners.push( inListener ) }
  function addBillerListener( inListener ) { billerListeners.push( inListener ) }
  function addCategoryListener( inListener ) { categoryListeners.push( inListener ) }

  function createBill() {
    const theDueDate = new Date()
    theDueDate.setDate( theDueDate.getDate() + 2 * 7 )
    return {
      amount: '',
      biller: '',
      categories: [],
      dueDate: theDueDate,
      id: uuid(),
      notificationDate: new Date()
    }
  }

  function filterBills( inBills, { inRange, inBillers, inCategories } ) {
    return inBills
      .filter( bill => !inRange || ( bill.dueDate >= inRange.startDate && bill.dueDate <= inRange.endDate ) )
      .filter( bill => !inBillers || inBillers.length === 0 || inBillers.includes( bill.biller ) )
      .filter( bill => !inCategories || inCategories.length === 0 || inCategories.some( inCategory => bill.inCategories.includes( inCategory ) ) )
  }

  function getBillers() { return getBilling().billers.sort() }

  function getBilling() {
    if ( ! localStorage.billing ) {
      localStorage.billing = JSON.stringify( {
        categories: [],
        billers: [],
        bills: []
      } )
    }
    return JSON.parse( localStorage.billing, ( inKey, inValue ) => {
      let theValue
      if ( inKey === 'notificationDate' || inKey === 'dueDate' ) {
        theValue = new Date( Date.parse( inValue ) )
      } else if ( inKey === 'repeatRule' ) {
        theValue = RepeatRuleService.parse( inValue )
      } else {
        theValue = inValue
      }
      return theValue
    } )
  }

  function getBills( inFilter ) {
    const theBills = getBilling().bills
    return inFilter == null ? theBills : theBills.filter( inFilter )
  }

  function getBillTemplateInstances( { range, billers, categories } ) {
    const theBillTemplateInstances = []
    const theBillTemplates = filterBills( getBills( isBillTemplate ), { billers, categories } )
    theBillTemplates.forEach( inBillTemplate => {
        RepeatRuleService.getRepeatDates( inBillTemplate.repeatRule, inBillTemplate.exDates, range.startDate, range.endDate  ).forEach( inDueDate => {
          const theBill = Object.assign( {}, inBillTemplate )
          theBill.dueDate = inDueDate
          theBill.id = uuid()
          theBill.repeatRule = inBillTemplate.repeatRule
          theBill.templateId = inBillTemplate.id          
          theBillTemplateInstances.push( theBill )
        } )
      } )
    return theBillTemplateInstances
  }

  function getCategories() { return getBilling().categories.sort() }
  function getEditDeleteOptionItems() { return editDeleteOptionItems }

  function getBillsFilteredAndSorted( sortOptions, filterOptions ) {
    const theBills = filterBills( getBills( isBill ), filterOptions )
    theBills.push( ...getBillTemplateInstances( filterOptions ) )
    BillSortService.sort( theBills, sortOptions )
    return theBills
  }

  function isBill( inBill ) { return ! inBill.repeatRule && ! inBill.templateId  }
  function isBillTemplate( inBill ) { return inBill.repeatRule && ! inBill.templateId }
  function isBillTemplateInstance( inBill ) { return inBill.templateId }

  function notifyBillListeners() { notifyListeners( billListeners ) }
  function notifyBillerListeners() { notifyListeners( billerListeners ) }
  function notifyCategoryListeners() { notifyListeners( categoryListeners ) }
  function notifyListeners( inListeners ) { inListeners.forEach( inListener => inListener() ) }

  function removeBill( inBill, removeOption ) {
    if ( isBillTemplateInstance( inBill ) ) {
      removeBillTemplateInstance( inBill, removeOption )
    } else {
      const theBills = getBills()    
      const theIndex = theBills.findIndex( theBill => theBill.id === inBill.id )
      if ( theIndex !== -1 ) {
        theBills.splice( theIndex, 1 )
        setBills( theBills )
        notifyBillListeners()
      }
    }
  }

  function removeBillTemplateInstance( inBillTemplateInstace, removeOption ) {
    const theBills = getBills()
    const theIndex = theBills.findIndex( theBill => theBill.id === inBillTemplateInstace.templateId )
    if ( theIndex !== -1 ) {
      const theTemplate = theBills[ theIndex ]
      let setBills = true
      if ( removeOption === editDeleteOptionThisOccurence ) {
        const theExDates = theTemplate.exDates ? theTemplate.exDates : []
        theExDates.push( inBillTemplateInstace.dueDate )
        theTemplate.exDates = theExDates
      } else if ( removeOption === editDeleteOptionThisAndFutureOccurences ) {
        let theEndDate = new Date( inBillTemplateInstace.dueDate )
        theEndDate.setDate( theEndDate.getDate() - 1 )
        theTemplate.repeatRule = RepeatRuleService.setUntil( theTemplate.repeatRule, theEndDate )
      } else if ( removeOption === editDeleteOptionAllOccurrences ) {
        removeBill( theTemplate )
        setBills = false
      }
      if ( setBills ) {
        setBills( theBills )
      }
      notifyBillListeners()
   }
  }

  function removeBillListener( inListener ) { removeListener( billListeners, inListener ) }
  function removeBillerListener( inListener ) { removeListener( billerListeners, inListener ) }
  function removeCategoryListener( inListener ) { removeListener( categoryListeners, inListener ) }
  function removeListener( inListeners, inListener ) {
    const theIndex = inListeners.indexOf( inListener )
    if ( theIndex !== -1 ) {
      inListeners.splice( theIndex, 1 )
    }
  }

  function setBillers( inBillers ) {
    const theBilling = getBilling()
    theBilling.billers = inBillers
    setBilling( theBilling )
  }

  function setCategories( inCategories ) {
    const theBilling = getBilling()
    theBilling.categories = inCategories
    setBilling( theBilling )
  }

  function setBilling( inBilling ) {
    localStorage.billing = JSON.stringify( inBilling, ( inKey, inValue ) => inKey === 'repeatRule' ? RepeatRuleService.stringify( inValue ) : inValue )
  }

  function setBills( inBills ) {
    const theBilling = getBilling()
    if ( inBills ) {
      theBilling.bills = inBills
    }
    setBilling( theBilling )
  }

  function updateBill( inBill ) {
    const theBills = getBills()    
    const theIndex = theBills.findIndex( theBill => theBill.id === inBill.id )
    if ( theIndex !== -1 ) {
      theBills.splice( theIndex, 1, inBill )
      setBills( theBills )
      addCategoriesFromBill( inBill )
      addBillerFromBill( inBill )
      notifyBillListeners()
    }
  }
 
  return {
    addBill: addBill,
    addBillListener: addBillListener,
    addBillerListener: addBillerListener,
    addCategoryListener: addCategoryListener,
    createBill: createBill,
    getBillers: getBillers,
    getCategories: getCategories,
    getEditDeleteOptionItems: getEditDeleteOptionItems,
    getBills: getBillsFilteredAndSorted,
    isBill: isBill,
    isBillTemplate: isBillTemplate,
    isBillTemplateInstance: isBillTemplateInstance,
    removeBill: removeBill,
    removeBillListener: removeBillListener,
    removeBillerListener: removeBillerListener,
    removeCategoryListener: removeCategoryListener,
    updateBill: updateBill
  }
} )()

export default BillService