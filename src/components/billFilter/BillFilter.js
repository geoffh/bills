import React, { useState } from 'react'

import 'react-dates/initialize'

import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import { DateRangePicker } from 'react-dates'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import moment from 'moment'

import CheckboxGroup from '../utils/CheckboxGroup'

import 'react-dates/lib/css/_datepicker.css'

export default function BillFilter( props ) {
    const { billers, categories, range, onClose } = props
    const [ dateRangeFocusedInput, setDateRangeFocusedInput ] = useState( null )

    function getBillers() {
        return <CheckboxGroup label = 'Billers' items = { billers.billers } selectedItems = { billers.selectedBillers }
            onSelectItem = { billers.onSelectBiller } onSelectAll = { billers.onSelectAllBillers }/>
    }

    function getCategories() {
        return <CheckboxGroup label = 'Categories' items = { categories.categories } selectedItems = { categories.selectedCategories }
            onSelectItem = { categories.onSelectCategory } onSelectAll = { categories.onSelectAllCategories }/>
    }

    function getRange() {
        return (
            <DateRangePicker block noBorder
                        startDate={ range.startDate ? moment( range.startDate ): null } startDateId="startDateId"
                        endDate={ range.endDate ? moment( range.endDate ) : null } endDateId="endDateId"
                        onDatesChange={ onChangeRange } focusedInput={ dateRangeFocusedInput } onFocusChange={ onChangeDateRangeFocusedInput }
                        isOutsideRange={ () => false }/>
        )
    }

    function onChangeDateRangeFocusedInput( inDateRangeFocusedInput ) { setDateRangeFocusedInput( inDateRangeFocusedInput ) }
    function onChangeRange( inRange ) { range.onChangeRange( { startDate: inRange.startDate.toDate(), endDate: inRange.endDate.toDate() } ) }

    function onClickCloseButton() { onClose && onClose() }

    return (
        <Drawer { ...props } anchor = 'right'>
            <div>
            <IconButton onClick = { onClickCloseButton }><ChevronRightIcon/></IconButton>
            </div>
            <Divider/>
            { getRange() }
            <Divider/>
            { getCategories() }
            <Divider/>
            { getBillers() }
        </Drawer>
    )
}