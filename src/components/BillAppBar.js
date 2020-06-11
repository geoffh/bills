import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import './BillAppBar.css';
import AddBillButton from './AddBillButton';

export default class BillAppBar extends React.Component {
    render() {
        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu"><MenuIcon/></IconButton>
                        <Typography variant="h6">Bills</Typography>
                        <div className="toolbarButtons">
                            <AddBillButton/>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
};