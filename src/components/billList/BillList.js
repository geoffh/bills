import React, { useEffect, useState } from 'react'

import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import IconButton from '@material-ui/core/IconButton'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

import './BillList.css'
import BillAddEditDialog from '../billAddEdit/BillAddEditDialog'
import BillEditDeleteOptionsDialog from '../billDelete/BillEditDeleteOptionsDialog'
import BillListHead from './BillListHead'
import { BillService } from '../../services/BillService'

const columnHeaders = [
    { columnId: 'biller', columnLabel: 'Biller' },
    { columnId: 'amount', columnLabel: 'Amount' },
    { columnId: 'dueDate', columnLabel: 'Due Date' }
]

const billDeleteOptionsDialogOkLabel = 'Ok'
const billDeleteOptionsDialogContentText = 'Select what you want to delete, click ' + billDeleteOptionsDialogOkLabel + '.'
const billDeleteOptionsDialogTitle = 'Delete repeating bill'

const billEditOkLabel = 'Save'
const billEditDialogContentText = 'Fill in the details, click ' + billEditOkLabel + '.'
const billEditDialogTitle = 'Change your bill'

export default function BillList( props ) {
    const { filters } = props
    const [ sortColumnId, setSortColumnId ] = useState( 'dueDate' )
    const [ sortColumnDirection, setSortColumnDirection ] = useState( 'asc' )
    const [ billToEdit, setBillToEdit ] = useState( null )
    const [ billToDelete, setBillToDelete ] = useState( null )
    const [ refreshing, setRefreshing ] = useState( false )

    useEffect( () => {
        BillService.addBillListener( refresh )
        return () => BillService.removeBillListener( refresh )
    }, [] )

    useEffect( () => {
        setRefreshing( false )
    }, [ refreshing ] )

    function createDelete( inBill ) {
        return () => BillService.isBillTemplateInstance( inBill ) ? setBillToDelete( inBill ) : BillService.removeBill( inBill )
    }
    
    function createEdit( inBill ) { return () => setBillToEdit( inBill ) }

    function createRows() {
        return BillService.getFilteredBills( filters ).map( inBill => {
            return (
                <TableRow hover key={ inBill.id }>
                    <TableCell>{ inBill.biller }</TableCell>
                    <TableCell>{ inBill.amount }</TableCell>
                    <TableCell>
                        { inBill.dueDate.toLocaleDateString('en-IE') }
                        <span className="visibleOnHover">
                            <IconButton onClick = { createEdit( inBill ) } size = "small" color = "inherit" aria-label = "edit"><Edit/></IconButton>
                            { billToEdit ?
                                <BillAddEditDialog open onCancel = { onCloseBillEditDialog }
                                    onClose = { onCloseBillEditDialog } onOk = { onSaveBillEditDialog }
                                    bill = { billToEdit }
                                    dialogTitle = { billEditDialogTitle } dialogContentText = { billEditDialogContentText } okLabel = { billEditOkLabel }/> :
                                null
                            }                            
                            { billToDelete ?
                                <BillEditDeleteOptionsDialog open onCancel = { onCloseBillEditDeleteOptionsDialog }
                                            onClose = { onCloseBillEditDeleteOptionsDialog } onOk = { onDeleteBill }
                                            dialogTitle={ billDeleteOptionsDialogTitle } dialogContentText={ billDeleteOptionsDialogContentText }/> :
                                null
                            }
                            <IconButton onClick = { createDelete( inBill ) } size = "small" color = "inherit" aria-label = "deleteBill"><Delete/></IconButton>
                        </span>
                    </TableCell>                   
                </TableRow>
            )
        } )
    }

    function onCloseBillEditDeleteOptionsDialog() { setBillToDelete( null ) }
    function onCloseBillEditDialog() { setBillToEdit( null ) }

    function onDeleteBill( inDeleteOption ) {
        BillService.removeBill( billToDelete, parseInt( inDeleteOption ) )
        setBillToDelete( null )
    }

    function onSaveBillEditDialog() {
        BillService.updateBill( billToEdit )
        setBillToEdit( null )
    }

    function refresh() { setRefreshing( true ) }

    function sort( inColumnId ) {
        let theSortColumnDirection
        if ( inColumnId !== sortColumnId || sortColumnDirection === false ) {
            theSortColumnDirection = 'asc'
        } else {
            theSortColumnDirection = sortColumnDirection === 'asc' ? 'desc' : false
        }
        const theColumnId = theSortColumnDirection !== false ? inColumnId : null
        setSortColumnId( theColumnId )
        setSortColumnDirection( theSortColumnDirection )
    }

    return (
        <Table>
            <BillListHead columnHeaders={ columnHeaders }
                sortColumnId={ sortColumnId } sortColumnDirection={ sortColumnDirection }
                onSort={ sort }/>
            <TableBody>{ createRows() }</TableBody>
        </Table>
    )
}