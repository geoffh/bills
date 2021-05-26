import React, { useState } from 'react'

import ItemSelect from '../utils/ItemSelect'
import RepeatRuleService from '../../services/RepeatRuleService'

export default function MonthlyByMonthDay( props ) {
    const { onChange } = props
    const [ monthday, setMonthday ] = useState( props.monthday )

    function onChangeMonthDay( inEvent ) {
        setMonthday( inEvent.target.value )
        onChange && onChange( inEvent.target.value )
    }

    return <ItemSelect { ... props } value={ monthday } onChange={ onChangeMonthDay } items={ RepeatRuleService.getDayNumberItems() }/>
}