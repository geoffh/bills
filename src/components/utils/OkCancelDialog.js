import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';

export default class OkCancelDialog extends React.Component {
    constructor( props ) {
        super( props );
        this.okLabel = this.props.okLabel ? this.props.okLabel : 'Ok';
        this.cancelLabel = this.props.cancelLabel ? this.props.cancelLabel : 'Cancel';
    }

    render() {
        return (
            <Dialog open={ this.props.open } onClose={ this.props.onClose } aria-labelledby="form-dialog-title">
                {this.props.children}
                <DialogActions>
                    <Button onClick={ this.props.onCancel } color="primary">{ this.cancelLabel }</Button>
                    <Button onClick={ this.props.onOk } color="primary">{ this.okLabel }</Button>
                </DialogActions>
            </Dialog>
        )
    }
};