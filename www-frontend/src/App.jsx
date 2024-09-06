import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, InputBase, BottomNavigation, BottomNavigationAction, Paper, ListItemText, Drawer, ListItemIcon, ListItem } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { SearchIcon, FavoriteIcon, HomeIcon, PersonIcon, DehazeIcon, SportsBarIcon, FastfoodIcon } from './components/common/icons.js';
import logo from './assets/Logo.png';
import BeersIndex from './components/BeersIndex'; // Importa el componente BeersIndex
import BarsIndex from './components/BarsIndex.jsx';

function App() {
  const [drawer, setDrawer] = useState(false);
  const toggleDrawer = () => {
    setDrawer(!drawer);
  };

  return (
    <Router>
      <div style={{ height: '100vh', backgroundImage: `url('/path/to/static/map/image.jpg')`, backgroundSize: 'cover' }}>
        <AppBar position="static" style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <img src={logo} alt="Logo" style={{ width: '40px' }} />
            </IconButton>
            <InputBase
              placeholder="Buscar..."
              inputProps={{ 'aria-label': 'buscar' }}
              style={{ marginLeft: 8, flex: 1, backgroundColor: 'white', borderRadius: '20px', padding: '0 10px' }}
            />
            <IconButton type="submit" color="inherit" aria-label="search">
              <SearchIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <div style={{ flex: 1, position: 'relative' }}>
          <Routes>
            <Route path="/beers" element={<BeersIndex />} />
            <Route path="/bars" element={<BarsIndex />} />
          </Routes>
        </div>

        <Paper elevation={3} style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
          <BottomNavigation showLabels>
            <BottomNavigationAction label="Favoritos" icon={<FavoriteIcon />} />
            <BottomNavigationAction component={Link} to="/" label="Inicio" icon={<HomeIcon />} />
            <BottomNavigationAction label="Perfil" icon={<PersonIcon />} />
            <BottomNavigationAction label="Search" icon={<DehazeIcon />} onClick={toggleDrawer} />
          </BottomNavigation>
        </Paper>

        <Drawer
          anchor="right"
          variant="temporary"
          open={drawer}
          onClose={toggleDrawer}
          ModalProps={{
            keepMounted: true, //Better performance on mobile
          }}
        >
          <ListItem button="Beers" component={Link} to="/beers" onClick={toggleDrawer}>
            <ListItemIcon>
              <SportsBarIcon />
            </ListItemIcon>
            <ListItemText primary="Beers" />
          </ListItem>

          <ListItem button="Bars" component={Link} to="/bars" onClick={toggleDrawer}>
            <ListItemIcon>
              <FastfoodIcon />
            </ListItemIcon>
            <ListItemText primary="Bars" />
          </ListItem>
        </Drawer>
      </div>
    </Router>
  );
}

export default App;
