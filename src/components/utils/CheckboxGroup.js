import React from 'react'

import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormLabel from '@material-ui/core/FormLabel'

export default function CheckboxGroup( props ) {
    const { selectedItems, items, onSelectAll, onSelectItem, label } = props

    function isAllSelected() { return selectedItems && selectedItems.length === items.length }
    function isSelected( inItem ) { return selectedItems && selectedItems.includes( inItem ) }

    function getAllCheckBox() {
        return onSelectAll ?
            <FormControlLabel key = { 'All' } label = { 'All' } control = { <Checkbox onChange = { onSelectAll } checked = { isAllSelected() } name = { 'All' }/> }/> :
            null
    }

    function getCheckBoxes() {
        return items && items.length > 0 ?
            items.map( ( inItem, inIndex ) => 
                <FormControlLabel key = { inItem + inIndex } label={ inItem } control = { <Checkbox  onChange = { onSelectItem } checked = { isSelected( inItem ) } name = { inItem } /> }/>
            ) : null
    }
    
    return (
        <FormControl>
            <FormLabel>{ label }</FormLabel>
                <FormGroup>
                    { getAllCheckBox() }
                    { getCheckBoxes() }
                </FormGroup>
        </FormControl>
    )
}