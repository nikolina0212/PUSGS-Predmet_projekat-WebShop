import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import { Alert } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import ListItem from '@mui/material/ListItem';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ListItemButton from '@mui/material/ListItemButton';
import PublicIcon from '@mui/icons-material/Public';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../../redux/userSlice';
import { Link } from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';
import AddCardIcon from '@mui/icons-material/AddCard';
import ShopIcon from '@mui/icons-material/Shop';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ClearAllIcon from '@mui/icons-material/ClearAll';

const drawerWidth = 240;

export default function Dashboard({ content }) {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
  };
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
            <LocalMallIcon sx={{ fontSize: '40px', marginRight: '10px' }}/>
        <Typography
            variant="h4"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            ONLINE STORE
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/profile">
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>
        {user.role === 'Administrator' && (
        <ListItem disablePadding>
        <ListItemButton component={Link} to="/verification">
          <ListItemIcon>
            <VerifiedIcon />
          </ListItemIcon>
          <ListItemText primary="User verification" />
        </ListItemButton>
        </ListItem>
        )}
        {user.role === 'Administrator' && (
        <ListItem disablePadding>
        <ListItemButton component={Link} to="/admin-orders">
          <ListItemIcon>
            <ClearAllIcon />
          </ListItemIcon>
          <ListItemText primary="All orders" />
        </ListItemButton>
        </ListItem>
        )}
        {user.role === 'Purchaser' && (
        <ListItem disablePadding>
        <ListItemButton component={Link} to="/available-articles">
          <ListItemIcon>
            <AddCardIcon />
          </ListItemIcon>
          <ListItemText primary="Available articles" />
        </ListItemButton>
        </ListItem>
        )}
         {user.role === 'Purchaser' && (
        <ListItem disablePadding>
        <ListItemButton component={Link} to="/order">
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Order view" />
        </ListItemButton>
        </ListItem>
        )}
          {user.role === 'Purchaser' && (
        <ListItem disablePadding>
        <ListItemButton component={Link} to="/pending">
          <ListItemIcon>
            <QuestionMarkIcon />
          </ListItemIcon>
          <ListItemText primary="Pending orders" />
        </ListItemButton>
        </ListItem>
        )}
         {user.role === 'Purchaser' && (
        <ListItem disablePadding>
        <ListItemButton component={Link} to="/history">
          <ListItemIcon>
            <MoreHorizIcon />
          </ListItemIcon>
          <ListItemText primary="Orders history" />
        </ListItemButton>
        </ListItem>
        )}
        {user.role === 'Seller' && user.isVerified === 'True' && (
        <ListItem disablePadding>
        <ListItemButton component={Link} to="/my-articles">
          <ListItemIcon>
            <ShopIcon />
          </ListItemIcon>
          <ListItemText primary="My articles" />
        </ListItemButton>
        </ListItem>
        )}
        {user.role === 'Seller' && user.isVerified === 'True' && (
        <ListItem disablePadding>
        <ListItemButton component={Link} to="/add-article">
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Add new article" />
        </ListItemButton>
        </ListItem>
        )}
        {user.role === 'Seller' && user.isVerified === 'True' && (
        <ListItem disablePadding>
        <ListItemButton component={Link} to="/new">
          <ListItemIcon>
            <FiberNewIcon />
          </ListItemIcon>
          <ListItemText primary="New" />
        </ListItemButton>
        </ListItem>
        )}
        {user.role === 'Seller' && user.isVerified === 'True' && (
        <ListItem disablePadding>
        <ListItemButton component={Link} to="/delivered">
          <ListItemIcon>
            <DoneAllIcon />
          </ListItemIcon>
          <ListItemText primary="Delivered" />
        </ListItemButton>
        </ListItem>
        )}
        {user.role === 'Seller' && user.isVerified === 'True' && (
        <ListItem disablePadding>
        <ListItemButton component={Link} to="/map">
          <ListItemIcon>
            <PublicIcon />
          </ListItemIcon>
          <ListItemText primary="Map" />
        </ListItemButton>
        </ListItem>
        )}
      </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        {user.isVerified === 'False' && (
          <Alert severity="error" style={{width: '400px'}}>
            You are not verified yet.  Verification status: {user.status}</Alert>
        )}
        {content}
      </Box>
    </Box>
  );
}