import { v4 as uuid } from 'uuid';

const localStorage = window.localStorage;

const BillService = {
  listeners : [],

  addCategory: function( inCategory ) {
    if ( inCategory ) {
      const theCategories = this.getCategories();
      if ( theCategories.indexOf( inCategory ) === -1 ) {
        theCategories.push( inCategory );
        this.setCategories( theCategories );
      }
    }
  },

  addCategoriesFromBill: function( inBill ) {
    if ( inBill.categories ) {
      inBill.categories.forEach( inCategory => this.addCategory( inCategory ) );
    }
  },

  addBill: function( inBill ) {
    const theBills = this.getBills();
    theBills.push( inBill );
    this.setBills( theBills );
    this.addCategoriesFromBill( inBill );
    this.notifyListeners();
  },

  addListener: function( inListener ) { this.listeners.push( inListener ); },

  createBill: function() {
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

  getBilling: function() {
    if ( ! localStorage.billing ) {
      localStorage.billing = JSON.stringify( {
        categories: [],
        bills: []
      } );
    }
    return JSON.parse( localStorage.billing, ( inKey, inValue ) => {
      return inKey === 'notificationDate' || inKey === 'dueDate' ? new Date( Date.parse( inValue ) ) : inValue;
    } );
  },

  getCategories: function() { return this.getBilling().categories.sort(); },

  getBills: function() { return this.getBilling().bills; },

  notifyListeners: function() { this.listeners.forEach( inListener => inListener() ); },

  removeBill: function( inBill ) {
    const theBills = this.getBills();
    const theIndex = theBills.findIndex( theBill => theBill.id === inBill.id );
    if ( theIndex !== -1 ) {
      theBills.splice( theIndex, 1 );
      this.setBills( theBills );
      this.notifyListeners();
    }
  },

  removeListener: function( inListener ) {
    const theIndex = this.listeners.indexOf( inListener );
    if ( theIndex !== -1 ) {
      this.listeners.splice( theIndex, 1 );
    }
  },

  setCategories: function( inCategories ) {
    const theBilling = this.getBilling();
    theBilling.categories = inCategories;
    this.setBilling( theBilling );
  },

  setBilling: function( inBilling ) { localStorage.billing = JSON.stringify( inBilling ); },

  setBills: function( inBills ) {
    const theBilling = this.getBilling();
    theBilling.bills = inBills;
    this.setBilling( theBilling );
  },

  updateBill: function( inBill ) {
    const theBills = this.getBills();
    const theIndex = theBills.findIndex( theBill => theBill.id === inBill.id );
    if ( theIndex !== -1 ) {
      theBills.splice( theIndex, 1, inBill );
      this.setBills( theBills );
      this.addCategoriesFromBill( inBill );
      this.notifyListeners();
    }
  }
};

export { BillService };