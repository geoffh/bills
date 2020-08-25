import React from 'react';

import 'react-dates/initialize';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { DateRangePicker } from 'react-dates';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import moment from 'moment';

import CheckboxGroup from '../utils/CheckboxGroup';

import 'react-dates/lib/css/_datepicker.css';

export default class BillFilter extends React.Component {
    constructor( inProps ) {
        super( inProps );
        this.state = { dateRangePickerVisible: false, dateRangeFocusedInput: null };
        this.dateRangePickerKey = 'dateRangePickerKey';
    }

    getBillers = () => {
        const theBillers = this.props.billers;
        return <CheckboxGroup label = 'Billers' items = { theBillers.billers } selectedItems = { theBillers.selectedBillers }
            onSelectItem = { theBillers.onSelectBiller } onSelectAll = { theBillers.onSelectAllBillers }/>
    };

    getCategories = () => {
        const theCategories = this.props.categories;
        return <CheckboxGroup label = 'Categories' items = { theCategories.categories } selectedItems = { theCategories.selectedCategories }
            onSelectItem = { theCategories.onSelectCategory } onSelectAll = { theCategories.onSelectAllCategories }/>
    };

    getRange = () => {
        const theRange = this.props.range;
        return (
            <DateRangePicker block noBorder
                        startDate={ theRange.startDate ? moment( theRange.startDate ): null } startDateId="startDateId"
                        endDate={ theRange.endDate ? moment( theRange.endDate ) : null } endDateId="endDateId"
                        onDatesChange={ this.onChangeRange } focusedInput={ this.state.dateRangeFocusedInput } onFocusChange={ this.onChangeDateRangeFocusedInput }
                        isOutsideRange={ () => false }/>
        )
    };

    onChangeDateRangeFocusedInput = inDateRangeFocusedInput => { this.setState( { dateRangeFocusedInput: inDateRangeFocusedInput } ) }
    onChangeRange = inRange => {
        this.setState( { dateRangePickerVisible: false } );
        this.props.range.onChangeRange( { startDate: inRange.startDate.toDate(), endDate: inRange.endDate.toDate() } );
    }

    onClickCloseButton = () => this.props.onClose && this.props.onClose();

    render() {
        return (
            <Drawer { ...this.props} anchor = 'right'>
                <div>
                <IconButton onClick = { this.onClickCloseButton }><ChevronRightIcon/></IconButton>
                </div>
                <Divider/>
                { this.getRange() }
                <Divider/>
                { this.getCategories() }
                <Divider/>
                { this.getBillers() }
            </Drawer>
        );
    }
};