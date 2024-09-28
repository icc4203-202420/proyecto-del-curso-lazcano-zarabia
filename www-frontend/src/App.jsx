import React, { useState, useReducer, useEffect, useRef } from 'react';
import { AppBar, Toolbar, IconButton, InputBase, BottomNavigation, BottomNavigationAction, Paper, ListItemText, Drawer, ListItemIcon, ListItem } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import { SearchIcon, FavoriteIcon, HomeIcon, PersonIcon, DehazeIcon, SportsBarIcon, FastfoodIcon } from './components/common/icons.js';
import { jwtDecode } from 'jwt-decode';

//importaciones de componentes
import logo from './assets/Logo.png';
import Home from './components/Home.jsx';
import Profile from './components/profile/Profile.jsx';
import Login from './components/profile/Login.jsx';
import SignUp from './components/profile/SignUp.jsx';
import UserShow from './components/Show/UserShow.jsx';
import BeerShow from './components/Show/BeerShow.jsx'
import BarShow from './components/Show/BarShow.jsx'
import EventShow from './components/Show/EventShow.jsx'
import BeerReviewIndex from './components/BeerReviewIndex.jsx';


//Las siguientes importanciones son para el mapa
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { useLoadGMapsLibraries } from './hooks/useLoadGMapsLibraries';
import { MAPS_LIBRARY, MARKER_LIBRARY, ControlPosition } from './constants';

const API_BEERS = 'http://127.0.0.1:3001/api/v1/beers';
const API_BARS = 'http://127.0.0.1:3001/api/v1/bars';
const API_USERS = 'http://127.0.0.1:3001/api/v1/users';

const dataReducer = (state, action) => {
  switch (action.type) {
    case 'BEERS_FETCH_INIT':
      return { ...state, isLoadingBeers: true, isError: false };
    case 'BEERS_FETCH_SUCCESS':
      return { ...state, isLoadingBeers: false, beers: action.payload };
    case 'BEERS_FETCH_FAILURE':
      return { ...state, isLoadingBeers: false, isError: true };

    case 'BARS_FETCH_INIT':
      return { ...state, isLoadingBars: true, isError: false };
    case 'BARS_FETCH_SUCCESS':
      return { ...state, isLoadingBars: false, bars: action.payload };
    case 'BARS_FETCH_FAILURE':
      return { ...state, isLoadingBars: false, isError: true };

    case 'EVENTS_FETCH_INIT':
      return { ...state, isLoadingEvents: true, isError: false };
    case 'EVENTS_FETCH_SUCCESS':
      return {
        ...state,
        isLoadingEvents: false,
        events: { ...state.events, [action.barId]: action.payload }, 
      };
    case 'EVENTS_FETCH_FAILURE':
      return { ...state, isLoadingEvents: false, isError: true };

    case 'USERS_FETCH_INIT':  
      return { ...state, isLoadingUsers: true, isError: false };
    case 'USERS_FETCH_SUCCESS': 
      return { ...state, isLoadingUsers: false, users: action.payload };
    case 'USERS_FETCH_FAILURE': 
      return { ...state, isLoadingUsers: false, isError: true };

    default:
      throw new Error();
  }
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [state, dispatch] = useReducer(dataReducer, {
    beers: [],
    bars: [],
    events: {},
    users: [],
    isLoadingBeers: false,
    isLoadingBars: false,
    isLoadingEvents: false,
    isLoadingUsers: false,
    isError: false,
  });

  //cosas de autenticación
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setSearchTerm(''); 
  }, [location.pathname]); 

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    const decodedToken = jwtDecode(token);
    localStorage.setItem('user_id', decodedToken.sub);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          handleLogout(); // Log out if token is expired
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        if (error instanceof DOMException) {
          console.error('DOMException occurred while decoding the token:', error.message);
        } else {
          console.error('Invalid token:', error);
        }
        handleLogout(); // Log out if token is invalid
      }
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!isAuthenticated && !['/login', '/signup'].includes(location.pathname) && !token) {
      navigate('/login');
    }
  }, [isAuthenticated, location.pathname, navigate]);


  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  useEffect(() => {
    dispatch({ type: 'BEERS_FETCH_INIT' });
    fetch(API_BEERS)
      .then((response) => response.json())
      .then((result) => {
        dispatch({ type: 'BEERS_FETCH_SUCCESS', payload: result.beers });
      })
      .catch(() => {
        dispatch({ type: 'BEERS_FETCH_FAILURE' });
      });
  }, []);

  //Fetch de los datos de usuarios

  useEffect(() => {
    dispatch({ type: 'USERS_FETCH_INIT' });
    fetch(API_USERS)
      .then((response) => response.json())
      .then((result) => {
        dispatch({ type: 'USERS_FETCH_SUCCESS', payload: result.users }); // Asumiendo que la respuesta contiene un array `users`
      })
      .catch(() => {
        dispatch({ type: 'USERS_FETCH_FAILURE' });
      });
  }, []);

  //Fetch de los datos de bares
  useEffect(() => {
    dispatch({ type: 'BARS_FETCH_INIT' });
  
    fetch(API_BARS)
      .then((response) => response.json())
      .then((result) => {
        dispatch({ type: 'BARS_FETCH_SUCCESS', payload: result.bars });
  
        // Extrae las ubicaciones de los bares y guárdalas en cities
        const barLocations = result.bars.map((bar) => ({
          name: bar.name,
          position: {
            lat: bar.latitude, // Asegúrate de que estos campos existan en los datos de bar
            lng: bar.longitude,
          },
        }));
  
        setCities(barLocations); // Guarda las ubicaciones en el estado cities
        setFilteredCities(barLocations);

        // Continuar obteniendo los eventos para cada bar
        result.bars.forEach((bar) => {
          fetch(`http://127.0.0.1:3001/api/v1/bars/${bar.id}/events`)
            .then((response) => response.json())
            .then((eventsResult) => {
              dispatch({ type: 'EVENTS_FETCH_SUCCESS', barId: bar.id, payload: eventsResult });
            })
            .catch(() => {
              dispatch({ type: 'EVENTS_FETCH_FAILURE' });
            });
        });
      })
      .catch(() => {
        dispatch({ type: 'BARS_FETCH_FAILURE' });
      });
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredBeers = searchTerm.toLowerCase() === 'beers'
  ? state.beers
  : state.beers.filter((beer) =>
      beer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const filteredBars = searchTerm.toLowerCase() === 'bars'
    ? state.bars
    : state.bars.filter((bar) =>
        bar.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const filteredEventsByBar = searchTerm.toLowerCase() === 'events'
    ? state.events
    : Object.keys(state.events).reduce((filtered, barId) => {
        const filteredEvents = state.events[barId].filter((event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filteredEvents.length > 0) {
          filtered[barId] = filteredEvents;
        }
        return filtered;
      }, {});

  const filteredUsers = searchTerm.toLowerCase() === 'users'
  ? state.users
  : state.users.filter((user) =>
      user.handle.toLowerCase().includes(searchTerm.toLowerCase())
    );




  
  return (
    < >
      <div style={{ height: '100vh', backgroundSize: 'cover' }}>
        <AppBar position="static" style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <img src={logo} alt="Logo" style={{ width: '40px' }} />
            </IconButton>
            <InputBase
              placeholder="Buscar..."
              inputProps={{ 'aria-label': 'buscar' }}
              style={{ marginLeft: 8, flex: 1, backgroundColor: 'white', borderRadius: '20px', padding: '0 10px' }}
              value={searchTerm}
              onChange={handleSearch}
            />
            <IconButton type="submit" color="inherit" aria-label="search">
              <SearchIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <hr />

        {searchTerm ? (
          <>
            {/* Sección de cervezas */}
            <h2>Beers</h2>
            {state.isLoadingBeers ? (
              <p>Loading beers...</p>
            ) : (
              <List list={filteredBeers} type="beer" />
            )}

            {/* Sección de bares */}
            <h2>Bars</h2>
            {state.isLoadingBars ? (
              <p>Loading bars...</p>
            ) : (
              <List list={filteredBars} type="bar" />
            )}

            {/* Sección de eventos */}
            <h2>Events</h2>
            {state.isLoadingEvents ? (
              <p>Loading events...</p>
            ) : (
              Object.keys(filteredEventsByBar).map((barId) => (
                <div key={barId}>
                  <h3>Events for Bar {barId}</h3>
                  <List list={filteredEventsByBar[barId]} type="event" />
                </div>
              ))
            )}

            {/* Sección de usuarios */}
            <h2>Users</h2>
            {state.isLoadingUsers ? (
              <p>Loading users...</p>
            ) : (
              <List list={filteredUsers} type="user" />
            )}
          </>
        ) : (
          <p></p>
        )}


      

        <div style={{ flex: 1, position: 'relative' }}>
          <Routes>
            <Route path="/" element={<Home cities={cities} filteredCities={filteredCities}/>} />
            <Route path="/profile" 
            element={<Profile 
              isAuthenticated={isAuthenticated} 
              userId={localStorage.getItem('user_id')} 
              handleLogout={handleLogout}/>} 
            />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/Login" element={<Login tokenHandler={handleLogin} />} />
            <Route path="/users/:id" element={<UserShow userId={localStorage.getItem('user_id')} />} />
            <Route path="/beers/:id" element={<BeerShow beers={state.beers} />} />
            <Route path="/beers/:id/reviews" element={<BeerReviewIndex />} />
            <Route path="/bars/:id" element={<BarShow bars={state.bars} />} />
            <Route path="/bars/:id_bar/events/:id_event" element={<EventShow />} />
          </Routes>
        </div>

        <Paper elevation={3} style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
          <BottomNavigation showLabels>
            <BottomNavigationAction label="Favoritos" icon={<FavoriteIcon />} />
            <BottomNavigationAction component={Link} to="/" label="Inicio" icon={<HomeIcon />} />
            <BottomNavigationAction component={Link} to="/profile"label="Perfil" icon={<PersonIcon />} />
          </BottomNavigation>
        </Paper>
      </div>
    </>
  );
}

const List = ({ list, type }) => (
  <ul>
    {list.map((item) => (
      <Item key={item.id} item={item} type={type} />
    ))}
  </ul>
);

const Item = ({ item, type }) => (
  <li>
    {type === 'beer' ? (
      <span>
        <Link to={`/beers/${item.id}`}> {item.name} </Link> - {item.style}
      </span>
    ) : type === 'bar' ? (
      <span>
        <Link to={`/bars/${item.id}`}> {item.name} </Link> {item.style}
      </span>
    ) : type === 'user' ? (
      <span>
        <Link to={`/users/${item.id}`}>{item.handle}</Link>
      </span>
    ) : (
      <span>{item.name}</span>
    )}
  </li>
);



export default App;