import React from 'react';

import Drawer from '@material-ui/core/Drawer';

export default class BillFilter extends React.Component {
    render() {
        return <Drawer { ...this.props} anchor = 'right'/>;
    }
};