import React from 'react';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';

import CheckboxGroup from '../utils/CheckboxGroup';

export default class BillFilter extends React.Component {
    getBillers = () => {
        const theBillers = this.props.billers;
        return <CheckboxGroup label = 'Billers' items = { theBillers.billers } selectedItems = { theBillers.selectedBillers }
            onSelectItem = { theBillers.onSelectBiller } onSelectAll = { theBillers.onSelectAllBillers }/>
    };

    getCategories = () => {
        const theCategories = this.props.categories;
        return <CheckboxGroup label = 'Categories' items = { theCategories.categories } selectedItems = { theCategories.selectedCategories }
            onSelectItem = { theCategories.onSelectCategory } onSelectAll = { theCategories.onSelectAllCategories }/>
    };

    onClickCloseButton = () => this.props.onClose && this.props.onClose();

    render() {
        return (
            <Drawer { ...this.props} anchor = 'right'>
                <div>
                <IconButton onClick = { this.onClickCloseButton }><ChevronRightIcon/></IconButton>
                </div>
                <Divider/>
                { this.getCategories() }
                <Divider/>
                { this.getBillers() }
            </Drawer>
        );
    }
};