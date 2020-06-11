import React from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

export default class ItemSelect extends React.Component {
    getItems() {
        return this.props.items.map( inItem => <MenuItem key={ inItem.value } value={ inItem.value }>{ inItem.label }</MenuItem> );
    }

    render() {
        return <Select { ...this.props } value={ this.props.value } onChange={ this.props.onChange }>{ this.getItems() }</Select>
    }
};