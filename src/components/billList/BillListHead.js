import React from 'react';

import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

export default class BillListHead extends React.Component {
    createHeaderCell( inColumnId, inLabel ) {
        return (
            <TableCell key={ inColumnId } sortDirection={ this.props.sortColumnId === inColumnId ? this.props.sortColumnDirection : false }>
                <TableSortLabel active={ this.props.sortColumnId === inColumnId }
                                direction={ this.getTableSortLabelDirection( inColumnId ) }
                                onClick={ this.createSort( inColumnId ) }>
                        { inLabel }
                </TableSortLabel>
            </TableCell>
        );
    }

    createHeaderCells() {
        return this.props.columnHeaders.map( inColumnHeader => this.createHeaderCell( inColumnHeader.columnId, inColumnHeader.columnLabel ) );
    }

    createSort( inColumnId ) {
        return () => this.props.onSort( inColumnId );
    }

    getTableSortLabelDirection( inColumnId ) {
        let theSortTableDirection = 'asc';
        if ( this.props.sortColumnId === inColumnId ) {
            theSortTableDirection = this.props.sortColumnDirection === 'desc' ? 'desc' : 'asc'
        }
        return theSortTableDirection;
    }

    render() {
        return (
            <TableHead>
                <TableRow>
                    { this.createHeaderCells() }
                </TableRow>
            </TableHead>
        );
    }
};