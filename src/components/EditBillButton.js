import React from 'react';

import Edit from '@material-ui/icons/Edit'
import IconButton from '@material-ui/core/IconButton';

import AddEditBillDialog from './AddEditBillDialog';
import { BillService } from '../services/BillService';

const okLabel = 'Save';
const dialogContentText = 'Fill in the details, click ' + okLabel + '.';
const dialogTitle = 'Change your bill';

export default class EditBillButton extends React.Component {
    constructor( inProps ) {
        super( inProps );
        this.state = { addEditBillDialogVisible: false };
    }

    onSaveBill = inBill => {
        this.onAddEditBillDialogClose();
        BillService.updateBill( inBill );
    }
    onAddEditBillDialogOpen = () => this.setAddEditBillDialogVisibility( true );
    onAddEditBillDialogClose = () => this.setAddEditBillDialogVisibility( false );
    setAddEditBillDialogVisibility( inVisible ) { this.setState( { addEditBillDialogVisible: inVisible } ); }

    render() {
        return (
            <>
                <IconButton onClick={ this.onAddEditBillDialogOpen } size="small" color="inherit" aria-label="edit"><Edit/></IconButton>
                <AddEditBillDialog open={ this.state.addEditBillDialogVisible } onCancel={ this.onAddEditBillDialogClose }
                                   onClose={ this.onAddEditBillDialogClose } onOk={ this.onSaveBill }
                                   bill={ this.props.bill }
                                   dialogTitle = { dialogTitle } dialogContentText = { dialogContentText } okLabel = { okLabel }/>
            </>
        )
    }
};