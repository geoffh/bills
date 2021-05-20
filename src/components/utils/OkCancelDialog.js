import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';

export default function OkCancelDialog( props ) {
    const { okLabel = 'Ok', cancelLabel = 'Cancel', open, onClose, children, onCancel, onOk } = props
    return (
        <Dialog open={ open } onClose={ onClose } aria-labelledby="form-dialog-title">
            {children}
            <DialogActions>
                <Button onClick={ onCancel } color="primary">{ cancelLabel }</Button>
                <Button onClick={ onOk } color="primary">{ okLabel }</Button>
            </DialogActions>
        </Dialog>
    )
}