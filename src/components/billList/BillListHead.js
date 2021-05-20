import React from 'react'

import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'

export default function BillListHead( props ) {
    const { sortColumnId, sortColumnDirection, columnHeaders, onSort } = props

    function createHeaderCell( inColumnId, inLabel ) {
        return (
            <TableCell key={ inColumnId } sortDirection={ sortColumnId === inColumnId ? sortColumnDirection : false }>
                <TableSortLabel active={ sortColumnId === inColumnId }
                                direction={ getTableSortLabelDirection( inColumnId ) }
                                onClick={ createSort( inColumnId ) }>
                        { inLabel }
                </TableSortLabel>
            </TableCell>
        )
    }

    function createHeaderCells() {
        return columnHeaders.map( inColumnHeader => createHeaderCell( inColumnHeader.columnId, inColumnHeader.columnLabel ) )
    }

    function createSort( inColumnId ) {
        return () => onSort( inColumnId )
    }

    function getTableSortLabelDirection( inColumnId ) {
        let theSortTableDirection = 'asc'
        if ( sortColumnId === inColumnId ) {
            theSortTableDirection = sortColumnDirection === 'desc' ? 'desc' : 'asc'
        }
        return theSortTableDirection
    }

    return (
        <TableHead>
            <TableRow>
                { createHeaderCells() }
            </TableRow>
        </TableHead>
    )
}