import React from 'react';

import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import './BillList.css';
import BillAddEditDialog from '../billAddEdit/BillAddEditDialog';
import BillListHead from './BillListHead';
import { BillService } from '../../services/BillService';

const columnHeaders = [
    { columnId: 'biller', columnLabel: 'Biller' },
    { columnId: 'amount', columnLabel: 'Amount' },
    { columnId: 'dueDate', columnLabel: 'Due Date' }
];

const billEditOkLabel = 'Save';
const billEditDialogContentText = 'Fill in the details, click ' + billEditOkLabel + '.';
const billEditDialogTitle = 'Change your bill';

export default class BillList extends React.Component {
    constructor( inProps ) {
        super( inProps );
        this.state = {
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
        return BillService.getFilteredBills( this.props.filters ).map( inBill => {
            return (
                <TableRow hover key={ inBill.id }>
                    <TableCell>{ inBill.biller }</TableCell>
                    <TableCell>{ inBill.amount }</TableCell>
                    <TableCell>
                        { inBill.dueDate.toLocaleDateString('en-IE') }
                        <span className="visibleOnHover">
                            <IconButton onClick = { this.createEdit( inBill ) } size = "small" color = "inherit" aria-label = "edit"><Edit/></IconButton>
                            { this.state.billToEdit ?
                                <BillAddEditDialog open onCancel = { this.onCloseBillEditDialog }
                                    onClose = { this.onCloseBillEditDialog } onOk = { this.onSaveBillEditDialog }
                                    bill = { this.state.billToEdit }
                                    dialogTitle = { billEditDialogTitle } dialogContentText = { billEditDialogContentText } okLabel = { billEditOkLabel }/> :
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

    onCloseBillEditDialog = () => { this.setState( { billToEdit: null } ); }

    onSaveBillEditDialog = () => {
        BillService.updateBill( this.state.billToEdit );
        this.setState( { billToEdit: null } );
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