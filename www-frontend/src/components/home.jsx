import React from 'react';
import { AppBar, Toolbar, IconButton, InputBase, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { SearchIcon, FavoriteIcon, HomeIcon, PersonIcon } from './common/icons.js';
import logo from '../assets/Logo.png';

function Home() {
  return (
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
        {/*Aqui en un futuro se aadiran los demas componentes que tendra la pagina web */}
      </div>

      <Paper elevation={3} style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
        <BottomNavigation showLabels>
          <BottomNavigationAction label="Favoritos" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Inicio" icon={<HomeIcon />} />
          <BottomNavigationAction label="Perfil" icon={<PersonIcon />} />
        </BottomNavigation>
      </Paper>
    </div>
  );
}

export default Home;
