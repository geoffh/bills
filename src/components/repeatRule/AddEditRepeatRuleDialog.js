import React from 'react';

import Box from '@material-ui/core/Box';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import './AddEditRepeatRuleDialog.css';
import End from './End';
import OkCancelDialog from '../utils/OkCancelDialog';
import FrequencyAndInterval from './FrequencyAndInterval';
import MonthlyByMonthDay from './MonthlyByMonthDay';
import MonthlyByWeekDay from './MonthlyByWeekDay';
import YearlyByMonthDay from './YearlyByMonthDay';
import { RepeatRuleService } from '../../services/RepeatRuleService';

export default class AddEditRepeatRuleDialog extends React.Component {
    constructor( inProps ) {
        super( inProps );
        this.state = this.createInitialState( inProps.repeatRule );
        this.monthlyStyle = { paddingBottom: '20px' };
    }

    createInitialState( inRepeatRule ) {
        const theRule = RepeatRuleService.createRuleFromRuleString( inRepeatRule );
        const theRuleType = RepeatRuleService.getRuleType( theRule );
        const theMonthlyRuleType = RepeatRuleService.ruleTypeMonthlyByWeekDay === theRuleType ?
            RepeatRuleService.ruleTypeMonthlyByWeekDay : RepeatRuleService.ruleTypeMonthlyByMonthDay;
        return {
            ruleType: theRuleType,
            monthlyRuleType: theMonthlyRuleType,
            startDate: RepeatRuleService.getStartDate( theRule ),
            frequency: RepeatRuleService.getFrequency( theRule ),
            interval: RepeatRuleService.getInterval( theRule ),
            monthlyByMonthDay: RepeatRuleService.getMonthlyByMonthDay( theRule ) || RepeatRuleService.createMonthlyByMonthDay( theRule ),
            monthlyByWeekDay: RepeatRuleService.getMonthlyByWeekDay( theRule ) || RepeatRuleService.createMonthlyByWeekDay( theRule ),
            yearlyByMonthDay: RepeatRuleService.getYearlyByMonthDay( theRule ) || RepeatRuleService.createYearlyByMonthDay( theRule ),
            end: RepeatRuleService.getEnd( theRule )
        };
    }

    getMonthly() {
        return RepeatRuleService.isMonthly( this.state.frequency ) ? (
            <Paper elevation={0} style={ this.monthlyStyle }>
                <RadioGroup name="monthly" value={ this.state.monthlyRuleType } onChange={ this.onChangeMonthlyRuleType }>
                    <FormLabel>On the</FormLabel>
                    <Box className="monthlyBox">
                        <FormControlLabel value={ RepeatRuleService.ruleTypeMonthlyByMonthDay } control={ <Radio/> }/>
                        <MonthlyByMonthDay monthday={ this.state.monthlyByMonthDay } onChange={ this.onChangeMonthlyByMonthDay } disabled={ ! this.isMonthlyByMonthDay() }/>
                    </Box>
                    <Box className="monthlyBox">
                        <FormControlLabel value={ RepeatRuleService.ruleTypeMonthlyByWeekDay } control={ <Radio/> }/>
                        <MonthlyByWeekDay weekday={ this.state.monthlyByWeekDay } onChange={ this.onChangeMonthlyByWeekDay } disabled={ ! this.isMonthlyByWeekDay() }/>
                    </Box>
                </RadioGroup>
            </Paper>
        ) : null;
    }

    getYearly() {
        return RepeatRuleService.isYearly( this.state.frequency ) ? (
            <Paper elevation={0} style={ this.monthlyStyle }>
                <div>
                    <FormLabel>On the</FormLabel>
                </div>
                <div>
                    <YearlyByMonthDay monthday={ this.state.yearlyByMonthDay } onChange={ this.onChangeYearlyByMonthDay }/>
                </div>
            </Paper>
        ) : null;
    }

    isMonthlyByMonthDay() { return RepeatRuleService.ruleTypeMonthlyByMonthDay === this.state.monthlyRuleType; }
    isMonthlyByWeekDay() { return RepeatRuleService.ruleTypeMonthlyByWeekDay === this.state.monthlyRuleType; }

    onChangeEnd = inEnd => { this.setState( { end: inEnd } ); }
    onChangeFrequency = inFrequency => { this.setState( { frequency: inFrequency } ); }
    onChangeInterval = inInterval => { this.setState( { interval: inInterval } ); }
    onChangeMonthlyByMonthDay = inMonthlyByMonthDay => { this.setState( { monthlyByMonthDay: inMonthlyByMonthDay } ) }
    onChangeMonthlyByWeekDay = inMonthlyByWeekDay => { this.setState( { monthlyByWeekDay: inMonthlyByWeekDay } ); }
    onChangeMonthlyRuleType = inEvent => { this.setState( { monthlyRuleType: inEvent.target.value } ); }
    onChangeYearlyByMonthDay = inYearlyByMonthDay => { this.setState( { yearlyByMonthDay: inYearlyByMonthDay } ) };

    onOk = () => {
        if ( ! this.props.onOk ) {
            return;
        }
        let theRuleString;
        if ( RepeatRuleService.isMonthly( this.state.frequency ) ) {
            theRuleString =  RepeatRuleService.ruleTypeMonthlyByMonthDay === this.state.monthlyRuleType ?
                RepeatRuleService.createMonthlyByMonthDayRuleString( this.state.startDate, this.state.interval, this.state.monthlyByMonthDay, this.state.end ) :
                RepeatRuleService.createMonthlyByWeekDayRuleString( this.state.startDate, this.state.interval, this.state.monthlyByWeekDay, this.state.end );
        } else {
            theRuleString = RepeatRuleService.createYearlyByMonthDayRuleString( this.state.startDate, this.state.interval, this.state.yearlyByMonthDay, this.state.end  );
        }
        this.props.onOk( theRuleString );
    }

    render() {
        return (
            <OkCancelDialog open={ this.props.open } onCancel={ this.props.onCancel }
                            onClose={ this.props.onClose } onOk={ this.onOk }
                            okLabel={ this.props.okLabel }>
                <DialogTitle id="form-dialog-title">{ this.props.dialogTitle }</DialogTitle>
                <DialogContent>
                    <DialogContentText>{ this.props.dialogContentText }</DialogContentText>
                    <FrequencyAndInterval frequency={ this.state.frequency } interval={ this.state.interval } onChangeFrequency={ this.onChangeFrequency } onChangeInterval={ this.onChangeInterval }/>
                    <Paper elevation={0} style={{marginLeft: '10px' } }>
                        { this.getMonthly() }
                        { this.getYearly() }
                        <End end={ this.state.end } onChange={ this.onChangeEnd }/>
                    </Paper>
                </DialogContent>
            </OkCancelDialog>
        )
    }
}