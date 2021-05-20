import React, { useState } from 'react'

import InputLabel from '@material-ui/core/InputLabel'

import AddEditRepeatRuleDialog from './AddEditRepeatRuleDialog'
import ItemSelect from '../utils/ItemSelect'
import { RepeatRuleService } from '../../services/RepeatRuleService'

const okLabel = 'Save'
const dialogContentText = 'Fill in the details, click ' + okLabel + '.'
const dialogTitle = 'Repeating bill'
const menuItemDoesNotRepeat = 'Does not repeat'
const menuItemOther = 'Other ...'

export default function RepeateRule( props ) {
    const { startDate, repeatRuleSet, onChange } = props
    const [ addEditRepeatRuleDialogVisible, setAddEditRepeatRuleDialogVisible ] = useState( false )
    const [ selection, setSelection ] = useState( getInitialSelection( props ) )

    function createMenuItems() {
        const theMenuItems = [ { value: menuItemDoesNotRepeat, label: menuItemDoesNotRepeat } ].concat(
            createQuickRules( startDate ).map( inRule => { return { value: inRule.toString(), label: inRule.toText() } } ) )
        theMenuItems.push( { value: menuItemOther, label: menuItemOther } )
        return theMenuItems
    }

    function createQuickRules( inStartDate ) {
        const theQuickRules = []
        if ( selection !== menuItemDoesNotRepeat ) {
            theQuickRules.push( RepeatRuleService.createRuleFromRuleString( selection ) )
        }        
        let theRule = RepeatRuleService.createMonthlyByMonthDayRule( inStartDate, 1 )
        if ( theRule.toString() !== selection ) {
            theQuickRules.push( theRule )
        }
        theRule = RepeatRuleService.createMonthlyByMonthDayRule( inStartDate, 2 )
        if ( theRule.toString() !== selection ) {
            theQuickRules.push( theRule )
        }
        theRule = RepeatRuleService.createMonthlyByWeekDayRule( inStartDate )
        if ( theRule.toString() !== selection ) {
            theQuickRules.push( theRule )
        }
        return theQuickRules
    }

    function getInitialSelection( inProps ) {
        const theRule = RepeatRuleService.getRuleFromRuleSet( inProps.repeatRule )
        return theRule ? theRule.toString() : menuItemDoesNotRepeat
    }

    function onAddEditRepeatRuleDialogClose() { setAddEditRepeatRuleDialogVisibility( false ) }
    function onChangeRepeatRule( inEvent ) { selectRule( inEvent.target.value ) }

    function onSaveRepeatRule( inRepeatRule ) {
        onAddEditRepeatRuleDialogClose()
        selectRule( inRepeatRule )
    }

    function ruleToRuleSet( inRule ) { return inRule === menuItemDoesNotRepeat ? null : RepeatRuleService.createRuleSet( repeatRuleSet, inRule ) }

    function selectRule( inRule ) {
        if ( inRule === menuItemOther ) {
            setAddEditRepeatRuleDialogVisible( true )
        } else {
            setSelection( inRule )
            onChange( ruleToRuleSet( inRule ) )
        }
    }

    function setAddEditRepeatRuleDialogVisibility( inVisible ) { setAddEditRepeatRuleDialogVisible( inVisible ) }


    let theAddEditRepeatRuleDialog
    if ( addEditRepeatRuleDialogVisible ) {
        const theRepeatRule = selection && selection !== menuItemDoesNotRepeat ? selection : RepeatRuleService.createMonthlyByMonthDayRule( startDate, 1 ).toString()
        theAddEditRepeatRuleDialog = <AddEditRepeatRuleDialog repeatRule={ theRepeatRule }
            open={ addEditRepeatRuleDialogVisible }
            onCancel={ onAddEditRepeatRuleDialogClose } onClose={ onAddEditRepeatRuleDialogClose } onOk={ onSaveRepeatRule }
            dialogTitle = { dialogTitle } dialogContentText = { dialogContentText } okLabel = { okLabel }/>
    } else {
        theAddEditRepeatRuleDialog = null
    }
    
    return (
        <>
            <InputLabel style={ {paddingTop: '10px'} }>Repeat</InputLabel>
            <ItemSelect value={ selection } onChange={ onChangeRepeatRule } items={ createMenuItems() }/>
            { theAddEditRepeatRuleDialog }
        </>
    )
}