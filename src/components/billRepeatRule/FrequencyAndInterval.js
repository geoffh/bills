import React, { useState } from 'react'


import Box from '@material-ui/core/Box'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import TextField from '@material-ui/core/TextField'

import ItemSelect from '../utils/ItemSelect'
import RepeatRuleService from '../../services/RepeatRuleService'

export default function FrequencyAndInterval( props ) {
    const [ frequency, setFrequency ] = useState( props.frequency )
    const [ interval, setInterval ] = useState( props.interval )
    const intervalLabelStyle = { marginLeft: '0px' }
    const intervalStyle = { paddingLeft: '20px', paddingBottom: '10px', paddingRight: '20px' }

    function onChangeFrequency( inEvent ) {
        setFrequency( inEvent.target.value )
        props.onChangeFrequency && props.onChangeFrequency( inEvent.target.value )
    }

    function onChangeInterval( inEvent ) {
        setInterval( inEvent.target.value )
        props.onChangeInterval && props.onChangeInterval( inEvent.target.value )
    }
    
    return (
        <FormGroup>
            <Box>
                <FormControlLabel control={ <TextField value={ interval } onChange={ onChangeInterval }
                                inputProps={ { min: "1",  max:"1000", step: "1" } } type="number" margin="normal" style={ intervalStyle }/> }
                                label="Repeat Every" labelPlacement="start" style={ intervalLabelStyle }/>             
                <ItemSelect value={ frequency } onChange={ onChangeFrequency } items={ RepeatRuleService.getFrequencyItems( interval > 1 ) }/>
            </Box>
        </FormGroup>
    )
}