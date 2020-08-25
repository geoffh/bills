import React from 'react';

import ItemSelect from '../utils/ItemSelect';

import { RepeatRuleService } from '../../services/RepeatRuleService';

export default class MonthlyByWeekDay extends React.Component {
    constructor( inProps ) {
        super( inProps );
        this.state = { weekday: inProps.weekday };
        this.dayStyle = { marginLeft: '10px' };       
    }

    onChange = inWeekDay => {
        this.setState( { weekday: inWeekDay } );
        this.props.onChange && this.props.onChange( inWeekDay );
    }

    onChangeDay = inEvent => {
        const theWeekDay = { day: inEvent.target.value, occurrence: this.state.weekday.occurrence };
        this.onChange( theWeekDay );
    }

    onChangeOccurrence = inEvent => {
        const theWeekDay = { day: this.state.weekday.day, occurrence: inEvent.target.value };
        this.onChange( theWeekDay );
    }

    render() {
        return (
            <>
                <ItemSelect { ...this.props } value={ this.state.weekday.occurrence } onChange={ this.onChangeOccurrence } items={ RepeatRuleService.getOccurrenceItems() }/>
                <ItemSelect { ...this.props } style={ this.dayStyle } value={ this.state.weekday.day } onChange={ this.onChangeDay } items={ RepeatRuleService.getDayItems() }/>
            </>
        );
    }
};