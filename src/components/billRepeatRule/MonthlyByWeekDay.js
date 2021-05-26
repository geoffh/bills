import React, { useState } from 'react'

import ItemSelect from '../utils/ItemSelect'
import RepeatRuleService from '../../services/RepeatRuleService'

export default function MonthlyByWeekDay( props ) {
    const { onChange } = props
    const [ weekday, setWeekday ] = useState( props.weekday )
    const dayStyle = { marginLeft: '10px' }

    function onChangemonthlyByWeekDay( inWeekDay ) {
        setWeekday( inWeekDay )
        onChange && onChange( inWeekDay )
    }

    function onChangeDay( inEvent ) {
        const theWeekDay = { day: inEvent.target.value, occurrence: weekday.occurrence }
        onChangemonthlyByWeekDay( theWeekDay )
    }

    function onChangeOccurrence( inEvent ) {
        const theWeekDay = { day: weekday.day, occurrence: inEvent.target.value }
        onChangemonthlyByWeekDay( theWeekDay )
    }
    
    return (
        <>
            <ItemSelect { ... props } value={ weekday.occurrence } onChange={ onChangeOccurrence } items={ RepeatRuleService.getOccurrenceItems() }/>
            <ItemSelect { ... props } style={ dayStyle } value={ weekday.day } onChange={ onChangeDay } items={ RepeatRuleService.getDayItems() }/>
        </>
    )
}