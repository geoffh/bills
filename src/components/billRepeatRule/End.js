import React, { useState } from 'react'

import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import Paper from '@material-ui/core/Paper'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import TextField from '@material-ui/core/TextField'

import DateSelector from '../utils/DateSelector'
import { RepeatRuleService } from '../../services/RepeatRuleService'

export default function End( props ) {
    const { onChange } = props
    const [ type, setType ] = useState( props.end.type )
    const [ count, setCount ] = useState( props.end.count )
    const [ until, setUntil ] = useState( props.end.until )

    function isEndOnDate() { return RepeatRuleService.isEndOnDate( type ) }
    function isEndAfterOccurrences() { return RepeatRuleService.isEndAfterOccurrences( type ) }

    function onChangeEnd( inType, inCount, inUntil ) {
        onChange( { type: inType, count: inCount, until: inUntil } )
    }

    function onChangeCount( inEvent ) {
        const theCount = inEvent.target.value
        setCount( theCount )
        onChangeEnd( type, theCount, until )
    }

    function onChangeType( inEvent ) {
        const theType = inEvent.target.value
        setType( theType )
        onChangeEnd( theType, count, until )
    }

    function onChangeUntil( inDate ) {
        setUntil( inDate )
        onChangeEnd( type, count, inDate )
    }

    return (
        <Paper elevation={0}>
            <FormControl>
                <RadioGroup name="end" value={ type } onChange={ onChangeType }>
                    <FormLabel>Ends</FormLabel>
                    <div>
                        <FormControlLabel value={ RepeatRuleService.endTypeNever }  control={ <Radio/> } label="Never"/>
                    </div>
                    <div>
                        <FormControlLabel value={ RepeatRuleService.endTypeDate } control={ <Radio/>} label="On"/>
                        <DateSelector value={ until } onChange={ onChangeUntil } disabled={ ! isEndOnDate() }/>
                    </div>
                    <div>
                        <FormControlLabel value={ RepeatRuleService.endTypeOccurrences } control={<Radio/>} label="After"/>
                        <TextField value={ count } onChange={ onChangeCount } disabled={ ! isEndAfterOccurrences() }
                                    inputProps={ { min: "1",  max:"1000", step: "1" } } type="number"/>
                    </div>
                </RadioGroup>
            </FormControl>
        </Paper>
    )
}