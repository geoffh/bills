import React from 'react';

import ItemSelect from '../utils/ItemSelect';
import { RepeatRuleService } from '../../services/RepeatRuleService';

export default class YearlyByMonthByMonthDay extends React.Component {
    constructor( inProps ) {
        super( inProps );
        this.state = { monthday: inProps.monthday };
        this.monthStyle = { marginLeft: '10px' };
        this.onChangeMonth = this.onChangeMonth.bind( this );
        this.onChangeDay = this.onChangeDay.bind( this ); 
    }
    
    onChange( inMonthDay ) {
        this.setState( { monthday: inMonthDay } );
        this.props.onChange && this.props.onChange( inMonthDay );
    }

    onChangeMonth( inEvent ) {
        const theMonthDay = { month: inEvent.target.value, day: this.state.monthday.day };
        this.onChange( theMonthDay );
    }

    onChangeDay( inEvent ) {
        const theMonthDay = { month: this.state.monthday.month, day: inEvent.target.value };
        this.onChange( theMonthDay );
    }

    render() {
        return (
            <>
                <ItemSelect { ...this.props } value={ this.state.monthday.day } onChange={ this.onChangeDay } items={ RepeatRuleService.getDayNumberItems() }/>
                <ItemSelect { ...this.props } style={ this.monthStyle } value={ this.state.monthday.month } onChange={ this.onChangeMonth } items={ RepeatRuleService.getMonthItems() }/>
            </>
        );
    }
};