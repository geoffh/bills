import React from 'react';

import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';

import { BillService } from '../services/BillService';
import ItemSelect from './utils/ItemSelect';

import 'react-dates/lib/css/_datepicker.css';

const moment = require('moment');

const itemSelectHeight = 400;
const itemSelectWidth = 200;
const itemSelectMargin = '20px';

export default class BillFilters extends React.Component {
    constructor( inProps ) {
        super( inProps );
        this.state = { dateRangePickerVisible: false, dateRangeFocusedInput: null };
        this.containerStyle = { display: 'flex', textAlign: 'center' };
        this.menuStyle = { display: 'inline-block', maxHeight:itemSelectHeight, width: itemSelectWidth, marginLeft: itemSelectMargin };
        this.dateRangePickerKey = 'dateRangePickerKey';
    }

    getRangeForTextField() {
        const theOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return this.props.filters.range.startDate.toLocaleDateString( undefined, theOptions ) + " -> " + this.props.filters.range.endDate.toLocaleDateString( undefined, theOptions );
    }

    onChangeBillers = ( inEvent ) => {
        const theFilters = this.props.filters;
        theFilters.billers = inEvent.target.value;
        this.props.onChange( theFilters );
    }

    onChangeCategories = inEvent => {
        const theFilters = this.props.filters;
        theFilters.categories = inEvent.target.value;
        this.props.onChange( theFilters );
    }

    onChangeRange = inRange => {
        const theFilters = this.props.filters;
        theFilters.range = { startDate: inRange.startDate.toDate(), endDate: inRange.endDate.toDate() };
        this.setState( { dateRangePickerVisible: false } );
        this.props.onChange( theFilters );
    }

    onChangeDateRangeFocusedInput = inDateRangeFocusedInput => { this.setState( { dateRangeFocusedInput: inDateRangeFocusedInput } ) }
    onClickRange = () => { this.setState( { dateRangePickerVisible: ! this.state.dateRangePickerVisible } ); }

    render() {
        return (
            <div style={ this.containerStyle }>
                <ItemSelect label="Categories" value={ this.props.filters.categories } onChange={ this.onChangeCategories } items={ BillService.getCategories() } style={ this.menuStyle } multiple/>
                <ItemSelect value={ this.props.filters.billers } onChange={ this.onChangeBillers } items={ BillService.getBillers() } style={ this.menuStyle } multiple/>
                <DateRangePicker block noBorder
                        startDate={ this.props.filters.range.startDate ? moment( this.props.filters.range.startDate ): null } startDateId="startDateId"
                        endDate={ this.props.filters.range.endDate ? moment( this.props.filters.range.endDate ) : null } endDateId="endDateId"
                        onDatesChange={ this.onChangeRange } focusedInput={ this.state.dateRangeFocusedInput } onFocusChange={ this.onChangeDateRangeFocusedInput }
                        isOutsideRange={ () => false }/>  
            </div>
        )
    }
};