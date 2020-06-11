import React from 'react';

import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

export default class DatePicker extends React.Component {
    render() {
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker { ...this.props }
                                    format="dd/MM/yyyy"
                                    variant="inline" autoOk
                                    KeyboardButtonProps={ { 'aria-label': 'change date', } }
                                    disableToolbar/>
            </MuiPickersUtilsProvider>
        )
    }
};