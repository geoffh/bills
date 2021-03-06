import React from 'react';

import InputLabel from '@material-ui/core/InputLabel';

import AddEditRepeatRuleDialog from './AddEditRepeatRuleDialog'
import ItemSelect from '../utils/ItemSelect';
import { RepeatRuleService } from '../../services/RepeatRuleService';

const okLabel = 'Save';
const dialogContentText = 'Fill in the details, click ' + okLabel + '.';
const dialogTitle = 'Repeating bill';
const menuItemDoesNotRepeat = 'Does not repeat';
const menuItemOther = 'Other ...';

export default class RepeatRule extends React.Component {
    constructor( inProps ) {
        super( inProps );
        this.state = {
            addEditRepeatRuleDialogVisible: false,
            selection: this.getInitialSelection( inProps ), 
            startDate: inProps.startDate
        };
    }

    createMenuItems() {
        const theMenuItems = [ { value: menuItemDoesNotRepeat, label: menuItemDoesNotRepeat } ].concat(
            this.createQuickRules( this.state.startDate ).map( inRule => { return { value: inRule.toString(), label: inRule.toText() }; } ) );
        theMenuItems.push( { value: menuItemOther, label: menuItemOther } );
        return theMenuItems;
    }

    createQuickRules( inStartDate ) {
        const theQuickRules = [];
        if ( this.state.selection !== menuItemDoesNotRepeat ) {
            theQuickRules.push( RepeatRuleService.createRuleFromRuleString( this.state.selection ) );
        }        
        let theRule = RepeatRuleService.createMonthlyByMonthDayRule( inStartDate, 1 )
        if ( theRule.toString() !== this.state.selection ) {
            theQuickRules.push( theRule );
        }
        theRule = RepeatRuleService.createMonthlyByMonthDayRule( inStartDate, 2 )
        if ( theRule.toString() !== this.state.selection ) {
            theQuickRules.push( theRule );
        }
        theRule = RepeatRuleService.createMonthlyByWeekDayRule( inStartDate );
        if ( theRule.toString() !== this.state.selection ) {
            theQuickRules.push( theRule );
        }
        return theQuickRules;
    }

    getInitialSelection( inProps ) {
        const theRule = RepeatRuleService.getRuleFromRuleSet( inProps.repeatRule );
        const theSelection = theRule ? theRule.toString() : menuItemDoesNotRepeat;
        return theSelection;
    }

    onAddEditRepeatRuleDialogOpen = () => this.setAddEditRepeatRuleDialogVisibility( true );
    onAddEditRepeatRuleDialogClose = () => this.setAddEditRepeatRuleDialogVisibility( false );
    onChange = inEvent => this.selectRule( inEvent.target.value );

    onSaveRepeatRule = inRepeatRule => {
        this.onAddEditRepeatRuleDialogClose();
        this.selectRule( inRepeatRule );
    }

    render() {
        let theAddEditRepeatRuleDialog;
        if ( this.state.addEditRepeatRuleDialogVisible ) {
            const theRepeatRule = this.state.selection && this.state.selection !== menuItemDoesNotRepeat ? this.state.selection : RepeatRuleService.createMonthlyByMonthDayRule( this.state.startDate, 1 ).toString();
            theAddEditRepeatRuleDialog = <AddEditRepeatRuleDialog repeatRule={ theRepeatRule }
                open={ this.state.addEditRepeatRuleDialogVisible }
                onCancel={ this.onAddEditRepeatRuleDialogClose } onClose={ this.onAddEditRepeatRuleDialogClose } onOk={ this.onSaveRepeatRule }
                dialogTitle = { dialogTitle } dialogContentText = { dialogContentText } okLabel = { okLabel }/>
        } else {
            theAddEditRepeatRuleDialog = null;
        }
        return (
            <>
                <InputLabel style={ {paddingTop: '10px'} }>Repeat</InputLabel>
                <ItemSelect value={ this.state.selection } onChange={ this.onChange } items={ this.createMenuItems() }/>
                { theAddEditRepeatRuleDialog }
           </>
        )
    }

    ruleToRuleSet( inRule ) { return inRule === menuItemDoesNotRepeat ? null : RepeatRuleService.createRuleSet( this.props.repeatRuleSet, inRule ); }

    selectRule( inRule ) {
        if ( inRule === menuItemOther ) {
            this.setState( { addEditRepeatRuleDialogVisible: true } );
        } else {
            this.setState( { selection: inRule } );
            this.props.onChange( this.ruleToRuleSet( inRule ) );
        }
    }

    setAddEditRepeatRuleDialogVisibility( inVisible ) { this.setState( { addEditRepeatRuleDialogVisible: inVisible } ); }
}