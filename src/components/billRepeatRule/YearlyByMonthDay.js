import React, { useState } from 'react'

import ItemSelect from '../utils/ItemSelect'
import RepeatRuleService from '../../services/RepeatRuleService'

export default function YearlyByMonthByMonthDay( props ) {
    const { onChange } = props
    const [ monthday, setMonthday ] = useState( props.monthday )
    const monthStyle = { marginLeft: '10px' }
    
    function onChangeYearlyByMonthDay( inMonthDay ) {
        setMonthday( inMonthDay )
        onChange && onChange( inMonthDay )
    }

    function onChangeMonth( inEvent ) {
        const theMonthDay = { month: inEvent.target.value, day: monthday.day }
        onChangeYearlyByMonthDay( theMonthDay )
    }

    function onChangeDay( inEvent ) {
        const theMonthDay = { month: monthday.month, day: inEvent.target.value }
        onChangeYearlyByMonthDay( theMonthDay )
    }

    return (
        <>
            <ItemSelect { ...props } value={ monthday.day } onChange={ onChangeDay } items={ RepeatRuleService.getDayNumberItems() }/>
            <ItemSelect { ...props } style={ monthStyle } value={ monthday.month } onChange={ onChangeMonth } items={ RepeatRuleService.getMonthItems() }/>
        </>
    )
}