import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';

import DatePicker from '../utils/DatePicker';
import { RepeatRuleService } from '../../services/RepeatRuleService';

export default class End extends React.Component {
    constructor( inProps ) {
        super( inProps );
        this.state = { end: inProps.end };
        this.onChangeCount = this.onChangeCount.bind( this );
        this.onChangeType = this.onChangeType.bind( this );
        this.onChangeUntil = this.onChangeUntil.bind( this );
    }

    isEndOnDate() { return RepeatRuleService.isEndOnDate( this.state.end.type ) };
    isEndNever() { return RepeatRuleService.isEndNever( this.state.end.type ) };
    isEndAfterOccurrences() { return RepeatRuleService.isEndAfterOccurrences( this.state.end.type ) };

    onChange( inEnd ) {
        this.setState( { end: inEnd } );
        this.props.onChange( inEnd );
    }

    onChangeCount( inEvent ) {
        const theEnd = this.state.end;
        theEnd.count = inEvent.target.value;
        this.onChange( theEnd );
    }

    onChangeType( inEvent ) {
        const theEnd = this.state.end;
        theEnd.type = inEvent.target.value;
        this.onChange( theEnd );
    }

    onChangeUntil( inDate ) {
        const theEnd = this.state.end;
        theEnd.date = inDate;
        this.onChange( theEnd );
    }

    render() {
        return (
            <Paper elevation={0}>
                <FormControl>
                    <RadioGroup name="end" value={ this.state.end.type } onChange={ this.onChangeType }>
                        <FormLabel>Ends</FormLabel>
                        <div>
                            <FormControlLabel value={ RepeatRuleService.endTypeNever }  control={ <Radio/> } label="Never"/>
                        </div>
                        <div>
                            <FormControlLabel value={ RepeatRuleService.endTypeDate } control={ <Radio/>} label="On"/>
                            <DatePicker value={ this.state.end.until } onChange={ this.onChangeUntil } disabled={ ! this.isEndOnDate() }/>
                        </div>
                        <div>
                            <FormControlLabel value={ RepeatRuleService.endTypeOccurrences } control={<Radio/>} label="After"/>
                            <TextField value={ this.state.end.count } onChange={ this.onChangeCount } disabled={ ! this.isEndAfterOccurrences() }
                                        inputProps={ { min: "1",  max:"1000", step: "1" } } type="number"/>
                        </div>
                    </RadioGroup>
                </FormControl>
            </Paper>
        )
    }
};