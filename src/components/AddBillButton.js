import React from 'react';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import IconButton from '@material-ui/core/IconButton';

import AddEditBillDialog from './AddEditBillDialog';
import { BillService } from '../services/BillService';

const okLabel = 'Add Bill';
const dialogContentText = 'Fill in the details, click ' + okLabel + '.';
const dialogTitle = 'Add a bill';

export default class AddBillButton extends React.Component {
    constructor( inProps ) {
        super( inProps );
        this.state = { addEditBillDialogVisible: false };
    }

    onAddBill = inBill => {
        this.onAddEditBillDialogClose();
        BillService.addBill( inBill );
    }

    onAddEditBillDialogOpen = () => this.setAddEditBillDialogVisibility( true );
    onAddEditBillDialogClose = () => this.setAddEditBillDialogVisibility( false );
    setAddEditBillDialogVisibility( inVisible ) { this.setState( { addEditBillDialogVisible: inVisible } ); }

    render() {
        let theAddEditBillDialog;
        if ( this.state.addEditBillDialogVisible ) {
            theAddEditBillDialog = <AddEditBillDialog open={ this.state.addEditBillDialogVisible } onCancel={ this.onAddEditBillDialogClose }
                onClose={ this.onAddEditBillDialogClose } onOk={ this.onAddBill }
                bill={ BillService.createBill() } categories={ BillService.getCategories() }
                dialogTitle = { dialogTitle } dialogContentText = { dialogContentText } okLabel = { okLabel }/>
        } else {
            theAddEditBillDialog = null;
        }
        return (
            <>
                <IconButton onClick={ this.onAddEditBillDialogOpen } size="small" color="inherit" aria-label="add"><AddCircleOutlineIcon/></IconButton>
                { theAddEditBillDialog }
            </>
        )
    }
};