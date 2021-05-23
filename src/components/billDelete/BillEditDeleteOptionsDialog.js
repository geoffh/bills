import React, { useState } from 'react'

import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControl from '@material-ui/core/FormControl'

import OkCancelDialog from '../utils/OkCancelDialog'
import ItemRadioGroup from '../utils/ItemRadioGroup'
import { BillService } from '../../services/BillService'

export default function BillEditDeleteOptionsDialog( props ) {
    const { open, name, label, dialogTitle, dialogContentText } = props
    const items = BillService.getEditDeleteOptionItems();
    const [ value, setValue ] = useState( items[ 0 ].value )

    function onChange( inEvent ) {
        setValue( inEvent.target.value )
    }

    function onOk() {
        props.onOk && props.onOk( value )
    }

    return (
        <OkCancelDialog open={ open } onCancel={ props.onCancel }
                        onClose={ props.onClose } onOk={ onOk }
                        okLabel={ 'Ok' }>
            <DialogTitle id="form-dialog-title">{ dialogTitle }</DialogTitle>
            <DialogContent>
                <DialogContentText>{ dialogContentText }</DialogContentText>
                <FormControl>
                    <ItemRadioGroup name={ name } label={ label } items={ items } value={ value } onChange={ onChange }/>
                </FormControl>
            </DialogContent>
        </OkCancelDialog>
    )
}