import React, { useState } from 'react';

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
import RepeatRuleService from '../../services/RepeatRuleService';

export default function AddEditRepeatRuleDialog( props ) {
    const { open, dialogTitle, dialogContentText, okLabel } = props
    const theInitialState = createInitialState( props.repeatRule )
    const [ monthlyRuleType, setMonthlyRuleType ] = useState( theInitialState.monthlyRuleType )
    const [ frequency, setFrequency ] = useState( theInitialState.frequency )
    const [ interval, setInterval ] = useState( theInitialState.interval )
    const [ monthlyByMonthDay, setMonthlyByMonthDay ] = useState( theInitialState.monthlyByMonthDay )
    const [ monthlyByWeekDay, setMonthlyByWeekDay ] = useState( theInitialState.monthlyByWeekDay )
    const [ yearlyByMonthDay, setYearlyByMonthDay ] = useState( theInitialState.yearlyByMonthDay )
    const [ end, setEnd ] = useState( theInitialState.end )
    const startDate = theInitialState.startDate
    const monthlyStyle = { paddingBottom: '20px' };

    function createInitialState( inRepeatRule ) {
        const theRule = RepeatRuleService.createRuleFromRuleString( inRepeatRule );
        const theRuleType = RepeatRuleService.getRuleType( theRule );
        const theMonthlyRuleType = RepeatRuleService.ruleTypeMonthlyByWeekDay === theRuleType ?
            RepeatRuleService.ruleTypeMonthlyByWeekDay : RepeatRuleService.ruleTypeMonthlyByMonthDay;
        return {
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

    function getMonthly() {
        return RepeatRuleService.isMonthly( frequency ) ? (
            <Paper elevation={0} style={ monthlyStyle }>
                <RadioGroup name="monthly" value={ monthlyRuleType } onChange={ onChangeMonthlyRuleType }>
                    <FormLabel>On the</FormLabel>
                    <Box className="monthlyBox">
                        <FormControlLabel value={ RepeatRuleService.ruleTypeMonthlyByMonthDay } control={ <Radio/> }/>
                        <MonthlyByMonthDay monthday={ monthlyByMonthDay } onChange={ onChangeMonthlyByMonthDay } disabled={ ! isMonthlyByMonthDay() }/>
                    </Box>
                    <Box className="monthlyBox">
                        <FormControlLabel value={ RepeatRuleService.ruleTypeMonthlyByWeekDay } control={ <Radio/> }/>
                        <MonthlyByWeekDay weekday={ monthlyByWeekDay } onChange={ onChangeMonthlyByWeekDay } disabled={ ! isMonthlyByWeekDay() }/>
                    </Box>
                </RadioGroup>
            </Paper>
        ) : null;
    }

    function getYearly() {
        return RepeatRuleService.isYearly( frequency ) ? (
            <Paper elevation={0} style={ monthlyStyle }>
                <div>
                    <FormLabel>On the</FormLabel>
                </div>
                <div>
                    <YearlyByMonthDay monthday={ yearlyByMonthDay } onChange={ onChangeYearlyByMonthDay }/>
                </div>
            </Paper>
        ) : null;
    }

    function isMonthlyByMonthDay() { return RepeatRuleService.ruleTypeMonthlyByMonthDay === monthlyRuleType; }
    function isMonthlyByWeekDay() { return RepeatRuleService.ruleTypeMonthlyByWeekDay === monthlyRuleType; }

    function onChangeEnd( inEnd ) { setEnd( inEnd ) }
    function onChangeFrequency( inFrequency ) { setFrequency( inFrequency ) }
    function onChangeInterval( inInterval ) { setInterval( inInterval ) }
    function onChangeMonthlyByMonthDay( inMonthlyByMonthDay ) { setMonthlyByMonthDay( inMonthlyByMonthDay ) }
    function onChangeMonthlyByWeekDay( inMonthlyByWeekDay ) { setMonthlyByWeekDay( inMonthlyByWeekDay ) }
    function onChangeMonthlyRuleType( inEvent ) { setMonthlyRuleType( inEvent.target.value ) }
    function onChangeYearlyByMonthDay( inYearlyByMonthDay ) { setYearlyByMonthDay( inYearlyByMonthDay ) }

    function onOk() {
        if ( ! props.onOk ) {
            return;
        }
        let theRuleString;
        if ( RepeatRuleService.isMonthly( frequency ) ) {
            theRuleString =  RepeatRuleService.ruleTypeMonthlyByMonthDay === monthlyRuleType ?
                RepeatRuleService.createMonthlyByMonthDayRuleString( startDate, interval, monthlyByMonthDay, end ) :
                RepeatRuleService.createMonthlyByWeekDayRuleString( startDate, interval, monthlyByWeekDay, end );
        } else {
            theRuleString = RepeatRuleService.createYearlyByMonthDayRuleString( startDate, interval, yearlyByMonthDay, end  );
        }
        props.onOk( theRuleString );
    }

    return (
        <OkCancelDialog open={ open } onCancel={ props.onCancel }
                        onClose={ props.onClose } onOk={ onOk }
                        okLabel={ okLabel }>
            <DialogTitle id="form-dialog-title">{ dialogTitle }</DialogTitle>
            <DialogContent>
                <DialogContentText>{ dialogContentText }</DialogContentText>
                <FrequencyAndInterval frequency={ frequency } interval={ interval } onChangeFrequency={ onChangeFrequency } onChangeInterval={ onChangeInterval }/>
                <Paper elevation={0} style={ {marginLeft: '10px' } }>
                    { getMonthly() }
                    { getYearly() }
                    <End end={ end } onChange={ onChangeEnd }/>
                </Paper>
            </DialogContent>
        </OkCancelDialog>
    )
}