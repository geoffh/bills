import React, { useState } from 'react'

import Autocomplete from '@material-ui/lab/Autocomplete'
import Chip from '@material-ui/core/Chip'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'

import BillEditDeleteOptionsDialog from '../billDelete/BillEditDeleteOptionsDialog'
import BillService from '../../services/BillService'
import DateSelector from '../utils/DateSelector'
import OkCancelDialog from '../utils/OkCancelDialog'
import RepeatRule from '../billRepeatRule/RepeatRule'

export default function BillAddEditDialog( props ) {
    const { bill, open, dialogTitle, dialogContentText, okLabel } = props
    const [ biller, setBiller ] = useState( bill.biller )
    const [ amount, setAmount ] = useState( bill.amount )
    const [ notificationDate, setNotificationDate ] = useState( bill.notificationDate )
    const [ dueDate, setDueDate ] = useState( bill.dueDate )
    const [ repeatRule, setRepeatRule ] = useState( bill.repeatRule )
    const [ categories, setCategories ] = useState( bill.categories )
    const [ showBillEditDeleteOptionsDialog, setShowBillEditDeleteOptions ] = useState( false )

    function createDeleteCategory( inCategory ) {
        return () => deleteCategory( inCategory )
    }

    function deleteCategory( inCategory ) {
        const theIndex = categories.indexOf( inCategory )
        if ( theIndex !== -1 ) {
            categories.splice( theIndex, 1 )
            setCategories( [ ...categories ] )
        }
    }

    function getBillCategories() { return categories ? categories : [] }

    function getBillEditDeleteOptionsDialog() {
        return showBillEditDeleteOptionsDialog ?
            (
                <BillEditDeleteOptionsDialog open onCancel = { onCloseBillEditDeleteOptionsDialog }
                                             onClose = { onCloseBillEditDeleteOptionsDialog } onOk = { onBillEditDeleteOptionsDialogOk }
                                             dialogTitle={ dialogTitle } dialogContentText={ dialogContentText }/>
            ) : null
    }

    function getCategoriesRenderInput( inParams ) { return <TextField { ... inParams } label="Choose a category for your bill"/> }

    function getCategoriesRenderTags( inCategories, getTagProperties ) {
        return inCategories.map( ( inCategory, inIndex ) => (
            <Chip { ...getTagProperties( { inIndex } ) } onDelete={ createDeleteCategory( inCategory ) } label={ inCategory } key={ inCategory } />
        ) )
    }

    function getKnownCategories() { return BillService.getCategories() }

    function onBillEditDeleteOptionsDialogOk( inBillEditDeleteOption ) {
        onOk( null, inBillEditDeleteOption )
    }

    function onChangeAmount( inEvent ) { setAmount( inEvent.target.value ) }
    function onChangeBiller( inEvent ) { setBiller( inEvent.target.value ) }

    function onChangeCategories( inEvent, inCategories, inReason ) {
        if ( inReason === 'create-option' || inReason === 'select-option' ) {
            setCategories( Array.from( inCategories ) )
        }
    }

    function onChangeDueDate( inDueDate ) { setDueDate( inDueDate ) }
    function onChangeNotificationDate( inNotificationDate ) { setNotificationDate( inNotificationDate ) }
    function onChangeRepeatRule( inRepeatRule ) { setRepeatRule( inRepeatRule ) }
    function onCloseBillEditDeleteOptionsDialog() { setShowBillEditDeleteOptions( false )}

    function onOk( inEvent, inBillEditDeleteOption ) {
        if ( BillService.isBillTemplateInstance( bill ) && ! inBillEditDeleteOption ) {
            setShowBillEditDeleteOptions( true )
        } else {
            updateBill()
            props.onOk && props.onOk( bill, inBillEditDeleteOption )
        }
    }

    function updateBill() {
        Object.assign( bill, bill, {
            biller: biller,
            amount: amount,
            notificationDate: notificationDate,
            dueDate: dueDate,
            repeatRule: repeatRule,
            categories: categories
        } )
    }
    
    return (
        <OkCancelDialog open={ open } onCancel={ props.onCancel }
                        onClose={ props.onClose } onOk={ onOk }
                        okLabel={ okLabel }>
            <DialogTitle id="form-dialog-title">{ dialogTitle }</DialogTitle>
            <DialogContent>
                <DialogContentText>{ dialogContentText }</DialogContentText>
                <TextField variant="outlined" value={ biller } onChange={ onChangeBiller } label="Biller" id="biller" autoFocus required fullWidth margin="dense" />
                <TextField variant="outlined" value={ amount } onChange={ onChangeAmount } label="Amount" id="amount" required fullWidth margin="dense"/>
                <DateSelector value={ notificationDate } onChange={ onChangeNotificationDate } label="Notification Date"/>
                <DateSelector value={ dueDate } onChange={ onChangeDueDate } label="Due Date"/>
                <RepeatRule repeatRule={ repeatRule } startDate={ dueDate } onChange={ onChangeRepeatRule }/>
                <Autocomplete id="categories" options={ getKnownCategories() }
                                value = { getBillCategories() }
                                onChange = { onChangeCategories }
                                renderInput = { getCategoriesRenderInput }
                                renderTags = { getCategoriesRenderTags }
                                autoComplete filterSelectedOptions freeSolo multiple/>
                { getBillEditDeleteOptionsDialog() }
            </DialogContent>
        </OkCancelDialog>
    )
}