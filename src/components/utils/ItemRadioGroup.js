import React from 'react'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'

export default function ItemRadioGroup( props ) {
    const { name, label, items, value, onChange } = props

    function getRadios() {
        return items.map( inItem => (
            <div key={ inItem.value }><FormControlLabel value={ inItem.value.toString() } control={ <Radio/> } label={ inItem.label }/></div>
        ) )
    }

    return (
        <RadioGroup name={ name } value={ value.toString() } onChange={ onChange }>
            <FormLabel>{ label }</FormLabel>
            { getRadios() }
        </RadioGroup>
    )
}