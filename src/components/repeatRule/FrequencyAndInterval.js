import React from 'react';


import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';

import ItemSelect from '../utils/ItemSelect';
import { RepeatRuleService } from '../../services/RepeatRuleService';

export default class FrequencyAndInterval extends React.Component {
    constructor( inProps ) {
        super( inProps );
        this.state = {
            frequency: inProps.frequency,
            interval: inProps.interval
        }
        this.intervalLabelStyle = { marginLeft: '0px' };
        this.intervalStyle = { paddingLeft: '20px', paddingBottom: '10px', paddingRight: '20px' };
        this.onChangeFrequency = this.onChangeFrequency.bind( this );
        this.onChangeInterval = this.onChangeInterval.bind( this );
    }

    onChangeFrequency( inEvent ) {
        this.setState( { frequency: inEvent.target.value } );
        this.props.onChangeFrequency && this.props.onChangeFrequency( inEvent.target.value );
    }

    onChangeInterval( inEvent ) {
        this.setState( { interval: inEvent.target.value } );
        this.props.onChangeInterval && this.props.onChangeInterval( inEvent.target.value );
    }

    render() {
        return (
            <FormGroup>
                <Box>
                    <FormControlLabel control={ <TextField value={ this.state.interval } onChange={ this.onChangeInterval }
                                    inputProps={ { min: "1",  max:"1000", step: "1" } } type="number" margin="normal" style={ this.intervalStyle }/> }
                                    label="Repeat Every" labelPlacement="start" style={ this.intervalLabelStyle }/>             
                    <ItemSelect value={ this.state.frequency } onChange={ this.onChangeFrequency } items={ RepeatRuleService.getFrequencyItems( this.state.interval > 1 ) }/>
                </Box>
            </FormGroup>
        )
    }
};