import React from 'react';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AppBar from '@material-ui/core/AppBar';
import FilterListIcon from '@material-ui/icons/FilterList';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import './BillAppBar.css';

export default class BillAppBar extends React.Component {
    render() {
        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu"><MenuIcon/></IconButton>
                        <Typography variant="h6">Bills</Typography>
                        <div className="toolbarButtons">
                            <IconButton onClick={ this.props.onClickBillFilter } size="small" color="inherit" aria-label="add"><FilterListIcon/></IconButton>
                            <IconButton onClick={ this.props.onClickBillAdd } size="small" color="inherit" aria-label="add"><AddCircleOutlineIcon/></IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
};