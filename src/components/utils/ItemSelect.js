import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

export default class ItemSelect extends React.Component {
    getItems() {
        return this.props.items.map( inItem => {
            const theItem = this.toItem( inItem );
            return <MenuItem key={ theItem.value } value={ theItem.value }>{ theItem.label }</MenuItem>
         } );
    }

    toItem( inItem ) { return inItem.value && inItem.label ?  inItem : { value: inItem , label: inItem };  }

    render() {
        return (
            <FormControl>
                { this.props.label ? <InputLabel shrink id="itemSelectLabel">{ this.props.label }</InputLabel> : null }
                <Select { ...this.props } value={ this.props.value } onChange={ this.props.onChange } labelId="itemSelectLabel">{ this.getItems() }</Select>
            </FormControl>
        )
    }
};