import { v4 as uuid } from 'uuid';

import { RepeatRuleService } from './RepeatRuleService';

const { localStorage } = window;

const BillService = {
  listeners : [],

  addBill( inBill ) {
    const { getBills, setBills } = this.getBillFunctions( inBill );
    const theBills = getBills();
    theBills.push( inBill );
    setBills( theBills );
    this.addCategoriesFromBill( inBill );
    this.addBillerFromBill( inBill );
    this.notifyListeners();
  },

  addBiller( inBiller ) {
    if ( inBiller ) {
      const theBillers = this.getBillers();
      if ( theBillers.indexOf( inBiller ) === -1 ) {
        theBillers.push( inBiller );
        this.setBillers( theBillers );
      }
    }
  },

  addBillerFromBill( inBill ) {
    this.addBiller( inBill.biller );
  },

  addCategory( inCategory ) {
    if ( inCategory ) {
      const theCategories = this.getCategories();
      if ( theCategories.indexOf( inCategory ) === -1 ) {
        theCategories.push( inCategory );
        this.setCategories( theCategories );
      }
    }
  },

  addCategoriesFromBill( inBill ) {
    if ( inBill.categories ) {
      inBill.categories.forEach( inCategory => this.addCategory( inCategory ) );
    }
  },

  addListener( inListener ) { this.listeners.push( inListener ); },

  createBill() {
    const theDueDate = new Date();
    theDueDate.setDate( theDueDate.getDate() + 2 * 7 );
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
        billTemplates: [],
        bills: []
      } );
    }
    return JSON.parse( localStorage.billing, ( inKey, inValue ) => {
      let theValue;
      if ( inKey === 'notificationDate' || inKey === 'dueDate' ) {
        theValue = new Date( Date.parse( inValue ) );
      } else if ( inKey === 'repeatRule' ) {
        theValue = RepeatRuleService.parse( inValue );
      } else {
        theValue = inValue;
      }
      return theValue;
    } )
  },

  getBillers() { return this.getBilling().billers.sort(); },

  getCategories() { return this.getBilling().categories.sort(); },

  getBillFunctions( inBill ) {
    return this.isBill( inBill ) ? 
      { getBills: this.getBills.bind( this ), setBills: this.setBills.bind( this ) } : 
      { getBills: this.getBillTemplates.bind( this ), setBills: this.setBillTemplates.bind( this ) };
  },

  getBillTemplates() { return this.getBilling().billTemplates; },

  getBills() { return this.getBilling().bills; },

  getBillsForRange( { startDate: inStartDate, endDate: inStopDate }  ) {
    const theBills = [];
    this.getBills().forEach( inBill => {
      if ( inBill.dueDate >= inStartDate && inBill.dueDate <= inStopDate ) {
        theBills.push( inBill );
      }
    } );
    this.getBillTemplates().forEach( inBill => {
      RepeatRuleService.getRepeatDates( inBill.repeatRule, inStartDate, inStopDate ).forEach( inDueDate => {
        const theBill = Object.assign( {}, inBill );
        theBill.id = uuid();
        theBill.dueDate = inDueDate;
        theBills.push( theBill );
      } );
    } );
    return theBills;
  },

  isBill( inBill ) { return ! this.isBillTemplate( inBill ); },

  isBillTemplate( inBillTemplate ) { return inBillTemplate.repeatRule; },

  notifyListeners() { this.listeners.forEach( inListener => inListener() ); },

  removeBill( inBill ) {
    const { getBills, setBills } = this.getBillFunctions( inBill );
    const theBills = getBills();
    
    const theIndex = theBills.findIndex( theBill => theBill.id === inBill.id );
    if ( theIndex !== -1 ) {
      theBills.splice( theIndex, 1 );
      setBills( theBills );
      this.notifyListeners();
    }
  },

  removeListener( inListener ) {
    const theIndex = this.listeners.indexOf( inListener );
    if ( theIndex !== -1 ) {
      this.listeners.splice( theIndex, 1 );
    }
  },

  setBillers( inBillers ) {
    const theBilling = this.getBilling();
    theBilling.billers = inBillers;
    this.setBilling( theBilling );
  },

  setCategories( inCategories ) {
    const theBilling = this.getBilling();
    theBilling.categories = inCategories;
    this.setBilling( theBilling );
  },

  setBilling( inBilling ) {
    localStorage.billing = JSON.stringify( inBilling, ( inKey, inValue ) => inKey === 'repeatRule' ? RepeatRuleService.stringify( inValue ) : inValue );
  },

  setBillTemplates( inBillTemplates ) {
    const theBilling = this.getBilling();
    theBilling.billTemplates = inBillTemplates;
    this.setBilling( theBilling );
  },

  setBills( inBills ) {
    const theBilling = this.getBilling();
    theBilling.bills = inBills;
    this.setBilling( theBilling );
  },

  updateBill( inBill ) {
    const { getBills, setBills } = this.getBillFunctions( inBill );
    const theBills = getBills();    
    const theIndex = theBills.findIndex( theBill => theBill.id === inBill.id );
    if ( theIndex !== -1 ) {
      theBills.splice( theIndex, 1, inBill );
      setBills( theBills );
      this.addCategoriesFromBill( inBill );
      this.addBillerFromBill( inBill );
      this.notifyListeners();
    }
  }
};

export { BillService };