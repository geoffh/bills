import React from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import { BillService } from '../../services/BillService';
import DateSelector from '../utils/DateSelector';
import OkCancelDialog from '../utils/OkCancelDialog';
import RepeatRule from '../repeatRule/RepeatRule';

export default class AddEditBillDialog extends React.Component {
    constructor( inProps ) {
        super( inProps );
        this.state = { bill: inProps.bill };
    }

    createDeleteCategory = inCategory => {
        return () => this.deleteCategory( inCategory );
    }

    deleteCategory = inCategory => {
        const theBill = this.state.bill;
        const theIndex = theBill.categories.indexOf( inCategory );
        if ( theIndex !== -1 ) {
            theBill.categories.splice( theIndex, 1 );
            this.setState ( { bill: theBill } );
        }
    }

    getBillCategories() {
        return this.state.bill.categories ? this.state.bill.categories : [];
    }

    getCategoriesRenderInput( inParams ) {
        return <TextField { ...inParams } label="Choose a category for your bill"/>
    }

    getCategoriesRenderTags = ( inCategories, getTagProperties ) => {
        return inCategories.map( ( inCategory, inIndex ) => (
            <Chip { ...getTagProperties( { inIndex } ) } onDelete={ this.createDeleteCategory( inCategory ) } label={ inCategory } key={ inCategory } />
        ) );
    }

    getKnownCategories() { return BillService.getCategories(); }    

    onChangeAmount = inEvent => {
        const theBill = this.state.bill;
        theBill.amount = inEvent.target.value;
        this.setState ( { bill: theBill } );
    }

    onChangeBiller = inEvent => {
        const theBill = this.state.bill;
        theBill.biller = inEvent.target.value;
        this.setState ( { bill: theBill } );
    }

    onChangeCategories = ( inEvent, inCategories, inReason ) => {
        if ( inReason === 'create-option' || inReason === 'select-option' ) {
            const theBill = this.state.bill;
            theBill.categories = Array.from( inCategories );
            this.setState ( { bill: theBill } );
        }
    }

    onChangeDueDate = inDueDate => {
        const theBill = this.state.bill;
        theBill.dueDate = inDueDate;
        this.setState ( { bill: theBill } );
    }

    onChangeNotificationDate = inNotificationDate => {
        const theBill = this.state.bill;
        theBill.notificationDate = inNotificationDate;
        this.setState ( { bill: theBill } );
    }

    onChangeRepeatRule = inRepeatRule => {
        const theBill = this.state.bill;
        theBill.repeatRule = inRepeatRule;
        this.setState ( { bill: theBill } );
    }

    onOk = () => {
        if ( this.props.onOk ) {
            this.props.onOk( this.state.bill );
        }
    }

    render() {
        return (
            <OkCancelDialog open={ this.props.open } onCancel={ this.props.onCancel }
                            onClose={ this.props.onClose } onOk={ this.onOk }
                            okLabel={ this.props.okLabel }>
                <DialogTitle id="form-dialog-title">{ this.props.dialogTitle }</DialogTitle>
                <DialogContent>
                    <DialogContentText>{ this.props.dialogContentText }</DialogContentText>
                    <TextField variant="outlined" value={ this.state.bill.biller } onChange={ this.onChangeBiller } label="Biller" id="biller" autoFocus required fullWidth margin="dense" />
                    <TextField variant="outlined" value={ this.state.bill.amount } onChange={ this.onChangeAmount } label="Amount" id="amount" required fullWidth margin="dense"/>
                    <DateSelector value={ this.state.bill.notificationDate } onChange={ this.onChangeNotificationDate } label="Notification Date"/>
                    <DateSelector value={ this.state.bill.dueDate } onChange={ this.onChangeDueDate } label="Due Date"/>
                    <RepeatRule repeatRule={ this.state.bill.repeatRule } startDate={ this.state.bill.dueDate } onChange={ this.onChangeRepeatRule }/>
                    <Autocomplete id="categories" options={ this.getKnownCategories() }
                                  value = { this.getBillCategories() }
                                  onChange = { this.onChangeCategories }
                                  renderInput = { this.getCategoriesRenderInput }
                                  renderTags = { this.getCategoriesRenderTags }
                                  autoComplete filterSelectedOptions freeSolo multiple/>
                </DialogContent>
            </OkCancelDialog>
        )
    }
};