import React from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';


export default class CheckboxGroup extends React.Component {
    isAllSelected = () => this.props.selectedItems && this.props.selectedItems.length === this.props.items.length;
    isSelected = inItem => this.props.selectedItems && this.props.selectedItems.includes( inItem );

    getAllCheckBox = () => {
        return this.props.onSelectAll ?
            <FormControlLabel key = { 'All' } label = { 'All' } control = { <Checkbox onChange = { this.props.onSelectAll } checked = { this.isAllSelected() } name = { 'All' }/> }/> :
            null;
    };

    getCheckBoxes = () => {
        const theItems = this.props.items;
        return theItems && theItems.length > 0 ?
            theItems.map( ( inItem, inIndex ) => 
                <FormControlLabel key = { inItem + inIndex } label={ inItem } control = { <Checkbox  onChange = { this.props.onSelectItem } checked = { this.isSelected( inItem ) } name = { inItem } /> }/>
            ) : null;
    };

    render() {
        return (
            <FormControl>
                <FormLabel>{ this.props.label }</FormLabel>
                    <FormGroup>
                        { this.getAllCheckBox() }
                        { this.getCheckBoxes() }
                    </FormGroup>
            </FormControl>
        );
    }
}