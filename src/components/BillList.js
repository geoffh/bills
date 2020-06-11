import React from 'react';

import Delete from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import './BillList.css';
import BillListHead from './BillListHead';
import { BillService } from '../services/BillService';
import EditBillButton from './EditBillButton';

const columnHeaders = [
    { columnId: 'biller', columnLabel: 'Biller' },
    { columnId: 'amount', columnLabel: 'Amount' },
    { columnId: 'dueDate', columnLabel: 'Due Date' }
];

export default class BillList extends React.Component {
    constructor( inProps ) {
        super( inProps );
        this.state = { sortColumnId: 'dueDate', sortColumnDirection: 'asc' };
        this.createDelete = this.createDelete.bind( this );
        this.refresh = this.refresh.bind( this );
        this.sort = this.sort.bind( this );
    }

    componentDidMount() { BillService.addListener( this.refresh ); }
    componentWillUnmount() { BillService.removeListener( this.refresh ); }

    createDelete( inBill ) {
        return () => BillService.removeBill( inBill );
    }

    createRows() {
        return BillService.getBills().map( inBill => {
            return (
                <TableRow hover key={ inBill.id }>
                    <TableCell>{ inBill.biller }</TableCell>
                    <TableCell>{ inBill.amount }</TableCell>
                    <TableCell>
                        { inBill.dueDate.toLocaleDateString('en-IE') }
                        <span className="visibleOnHover">
                            <EditBillButton bill={ inBill }/>
                            <IconButton onClick={ this.createDelete( inBill ) } size="small" color="inherit" aria-label="deleteBill"><Delete/></IconButton>
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

    refresh() {
        this.setState( { refreshing: true } );
    }

    sort( inColumnId ) {
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