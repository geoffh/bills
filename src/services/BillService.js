import { v4 as uuid } from 'uuid'

import { RepeatRuleService } from './RepeatRuleService'

const { localStorage } = window

const BillService = {
  billListeners : [],
  billerListeners: [],
  categoryListeners: [],

  addBill( inBill ) {
    const theBills = this.getBills()
    theBills.push( inBill )
    this.setBills( theBills )
    this.addCategoriesFromBill( inBill )
    this.addBillerFromBill( inBill )
    this.notifyBillListeners()
  },

  addBiller( inBiller ) {
    if ( inBiller ) {
      const theBillers = this.getBillers()
      if ( ! theBillers.includes( inBiller ) ) {
        theBillers.push( inBiller )
        this.setBillers( theBillers )
        this.notifyBillerListeners()
      }
    }
  },

  addBillerFromBill( inBill ) { this.addBiller( inBill.biller ) },

  addCategory( inCategory ) {
    if ( inCategory ) {
      const theCategories = this.getCategories()
      if ( ! theCategories.includes( inCategory ) ) {
        theCategories.push( inCategory )
        this.setCategories( theCategories )
        this.notifyCategoryListeners()
      }
    }
  },

  addCategoriesFromBill( inBill ) {
    if ( inBill.categories ) {
      inBill.categories.forEach( inCategory => this.addCategory( inCategory ) )
    }
  },

  addBillListener( inListener ) { this.billListeners.push( inListener ) },
  addBillerListener( inListener ) { this.billerListeners.push( inListener ) },
  addCategoryListener( inListener ) { this.categoryListeners.push( inListener ) },

  createBill() {
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
  },

  getBilling() {
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
  },

  getBillers() { return this.getBilling().billers.sort() },

  getCategories() { return this.getBilling().categories.sort() },

  getBills() { return this.getBilling().bills },

  getFilteredBills( { range: inRange, billers: inBillers, categories: inCategories } ) {
    const theBills = this.getBills()
      .filter( inBill => !inBill.repeatRule )
      .filter( inBill => inBill.dueDate >= inRange.startDate && inBill.dueDate <= inRange.endDate )
      .filter( inBill => !inBillers || inBillers.length === 0 || inBillers.includes( inBill.biller ) )
      .filter( inBill => !inCategories || inCategories.length === 0 || inCategories.some( inCategory => inBill.categories.includes( inCategory ) ) )
      this.getBills()
      .filter( inBill => inBill.repeatRule )
      .forEach( inBill => {
        RepeatRuleService.getRepeatDates( inBill.repeatRule, inRange.startDate, inRange.endDate  ).forEach( inDueDate => {
          const theBill = Object.assign( {}, inBill )
          theBill.id = uuid()
          theBill.dueDate = inDueDate
          theBills.push( theBill )
        } )
      } )
    return theBills
  },

  isBill(inBill) { return true },
  isBillTemplate(inBill) { return false },

  notifyBillListeners() { this.notifyListeners( this.billListeners ) },
  notifyBillerListeners() { this.notifyListeners( this.billerListeners ) },
  notifyCategoryListeners() { this.notifyListeners( this.categoryListeners ) },
  notifyListeners( inListeners ) { inListeners.forEach( inListener => inListener() ) },

  removeBill( inBill ) {
    const theBills = this.getBills()    
    const theIndex = theBills.findIndex( theBill => theBill.id === inBill.id )
    if ( theIndex !== -1 ) {
      theBills.splice( theIndex, 1 )
      this.setBills( theBills )
      this.notifyBillListeners()
    }
  },

  removeBillListener( inListener ) { this.removeListener( this.billListeners, inListener ) },
  removeBillerListener( inListener ) { this.removeListener( this.billerListeners, inListener ) },
  removeCategoryListener( inListener ) { this.removeListener( this.categoryListeners, inListener ) },
  removeListener( inListeners, inListener ) {
    const theIndex = inListeners.indexOf( inListener )
    if ( theIndex !== -1 ) {
      inListeners.splice( theIndex, 1 )
    }
  },

  setBillers( inBillers ) {
    const theBilling = this.getBilling()
    theBilling.billers = inBillers
    this.setBilling( theBilling )
  },

  setCategories( inCategories ) {
    const theBilling = this.getBilling()
    theBilling.categories = inCategories
    this.setBilling( theBilling )
  },

  setBilling( inBilling ) {
    localStorage.billing = JSON.stringify( inBilling, ( inKey, inValue ) => inKey === 'repeatRule' ? RepeatRuleService.stringify( inValue ) : inValue )
  },

  setBills( inBills ) {
    const theBilling = this.getBilling()
    theBilling.bills = inBills
    this.setBilling( theBilling )
  },

  updateBill( inBill ) {
    const theBills = this.getBills()    
    const theIndex = theBills.findIndex( theBill => theBill.id === inBill.id )
    if ( theIndex !== -1 ) {
      theBills.splice( theIndex, 1, inBill )
      this.setBills( theBills )
      this.addCategoriesFromBill( inBill )
      this.addBillerFromBill( inBill )
      this.notifyBillListeners()
    }
  }
}

export { BillService }