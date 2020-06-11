import React from 'react';

import ItemSelect from '../utils/ItemSelect';
import { RepeatRuleService } from '../../services/RepeatRuleService';

export default class MonthlyByMonthDay extends React.Component {
    constructor( inProps ) {
        super( inProps );
        this.state = { monthday: inProps.monthday };
        this.onChangeMonthDay = this.onChangeMonthDay.bind( this );
    }

    onChangeMonthDay( inEvent ) {
        this.setState( { monthday: inEvent.target.value } );
        this.props.onChange && this.props.onChange( inEvent.target.value );
    }

    render() {
        return <ItemSelect { ...this.props } value={ this.state.monthday } onChange={ this.onChangeMonthDay } items={ RepeatRuleService.getDayNumberItems() }/>
    }
};