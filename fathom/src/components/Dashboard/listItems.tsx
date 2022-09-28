import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
// import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { Link } from 'react-router-dom';
// import { color } from '@mui/system';

export const mainListItems = (
  <React.Fragment>
    <Link to="/" style={{ color: 'gray', textDecoration: 'inherit'}}>
    <ListItemButton>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
        <ListItemText primary="Dashboard" />
    </ListItemButton>
    </Link>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    {/* <ListSubheader component="div" inset>
      Swap
    </ListSubheader> */}
    <Link to="/swap" style={{ color: 'gray', textDecoration: 'inherit'}}>
    <ListItemButton>
      <ListItemIcon>
        <SwapHorizIcon />
      </ListItemIcon>
      <ListItemText primary="Stable Swap" />
    </ListItemButton>
    </Link>
  </React.Fragment>
);