import React from 'react'

import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'

export default function ItemSelect( props ) {
    const { items, label, value, onChange } = props

    function getItems() {
        return items.map( inItem => {
            const theItem = toItem( inItem )
            return <MenuItem key={ theItem.value } value={ theItem.value }>{ theItem.label }</MenuItem>
         } )
    }

    function toItem( inItem ) { return inItem.value !== undefined && inItem.label ?  inItem : { value: inItem , label: inItem }  }

    return (
        <FormControl>
            { label ? <InputLabel shrink id="itemSelectLabel">{ label }</InputLabel> : null }
            <Select { ...props } value={ value } onChange={ onChange } labelId="itemSelectLabel">{ getItems() }</Select>
        </FormControl>
    )
}