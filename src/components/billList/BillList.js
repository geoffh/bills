import React from 'react';

import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import './BillList.css';
import AddEditBillDialog from '../addEditBill/AddEditBillDialog';
import BillListHead from './BillListHead';
import { BillService } from '../../services/BillService';

const columnHeaders = [
    { columnId: 'biller', columnLabel: 'Biller' },
    { columnId: 'amount', columnLabel: 'Amount' },
    { columnId: 'dueDate', columnLabel: 'Due Date' }
];

const editBillOkLabel = 'Save';
const editBillDialogContentText = 'Fill in the details, click ' + editBillOkLabel + '.';
const editBillDialogTitle = 'Change your bill';

export default class BillList extends React.Component {
    constructor( inProps ) {
        super( inProps );
        this.state = {
            billers: BillService.getBillers(),
            categories: BillService.getCategories(),
            range: this.createInitialRange(),
            sortColumnId: 'dueDate', 
            sortColumnDirection: 'asc',
            billToEdit: null
        };
    }

    componentDidMount() { BillService.addListener( this.refresh ); }
    componentWillUnmount() { BillService.removeListener( this.refresh ); }

    createDelete =  inBill => { return () => BillService.removeBill( inBill ); };
    createEdit = inBill => { return () => { this.setState( { billToEdit: inBill } ); } };

    createInitialRange() {
        const theStartDate = new Date();
        theStartDate.setMonth( theStartDate.getMonth() - 2 );
        const theEndDate = new Date();
        theEndDate.setMonth( theEndDate.getMonth() + 2 );
        return { startDate: theStartDate, endDate: theEndDate }
    }

    createRows() {
        return BillService.getBillsForRange( this.state.range ).map( inBill => {
            return (
                <TableRow hover key={ inBill.id }>
                    <TableCell>{ inBill.biller }</TableCell>
                    <TableCell>{ inBill.amount }</TableCell>
                    <TableCell>
                        { inBill.dueDate.toLocaleDateString('en-IE') }
                        <span className="visibleOnHover">
                            <IconButton onClick = { this.createEdit( inBill ) } size = "small" color = "inherit" aria-label = "edit"><Edit/></IconButton>
                            { this.state.billToEdit ?
                                <AddEditBillDialog open onCancel = { this.onEditBillDialogClose }
                                    onClose = { this.onEditBillDialogClose } onOk = { this.onEditBillDialogSave }
                                    bill = { this.state.billToEdit }
                                    dialogTitle = { editBillDialogTitle } dialogContentText = { editBillDialogContentText } okLabel = { editBillOkLabel }/> :
                                null
                            }
                            <IconButton onClick = { this.createDelete( inBill ) } size = "small" color = "inherit" aria-label = "deleteBill"><Delete/></IconButton>
                        </span>
                    </TableCell>                   
                </TableRow>
            )
        } );
    }

    getTableSortLabelDirection( inColumnId ) {
        let theSortTableDirection = 'asc';
        if ( this.state.sortColumnId === inColumnId ) {
            theSortTableDirection = this.state.sortColumnDirection === 'desc' ? 'desc' : 'asc'
        }
        return theSortTableDirection;
    }

    onEditBillDialogClose = () => { this.setState( { billToEdit: null } ); }

    onEditBillDialogSave = () => {
        BillService.updateBill( this.state.billToEdit );
        this.onEditBillDialogClose();
    }

    refresh = () => this.setState( { refreshing: true } );

    sort = inColumnId => {
        let theSortColumnDirection;
        if ( inColumnId !== this.state.sortColumnId || this.state.sortColumnDirection === false ) {
            theSortColumnDirection = 'asc';
        } else {
            theSortColumnDirection = this.state.sortColumnDirection === 'asc' ? 'desc' : false;
        }
        const theColumnId = theSortColumnDirection !== false ? inColumnId : null;
        this.setState( { sortColumnId: theColumnId, sortColumnDirection: theSortColumnDirection } );
    }
    
    render() {
        return (
            <Table>
                <BillListHead columnHeaders={ columnHeaders }
                    sortColumnId={ this.state.sortColumnId } sortColumnDirection={ this.state.sortColumnDirection }
                    onSort={ this.sort }/>
                <TableBody>{ this.createRows() }</TableBody>
            </Table>
        )
    }
};