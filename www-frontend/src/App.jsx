import React, { useState, useReducer, useEffect, useRef } from 'react';
import { AppBar, Toolbar, IconButton, InputBase, BottomNavigation, BottomNavigationAction, Paper, ListItemText, Drawer, ListItemIcon, ListItem } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { SearchIcon, FavoriteIcon, HomeIcon, PersonIcon, DehazeIcon, SportsBarIcon, FastfoodIcon } from './components/common/icons.js';
import logo from './assets/Logo.png';
import Home from './components/Home.jsx';
import BeerShow from './components/BeerShow.jsx'
import BarShow from './components/BarShow.jsx'
import BeerReviewIndex from './components/BeerReviewIndex.jsx';
//Las siguientes importanciones son para el mapa
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { useLoadGMapsLibraries } from './hooks/useLoadGMapsLibraries';
import { MAPS_LIBRARY, MARKER_LIBRARY, ControlPosition } from './constants';

const API_BEERS = 'http://127.0.0.1:3001/api/v1/beers';
const API_BARS = 'http://127.0.0.1:3001/api/v1/bars';

const MAP_CENTER = { lat: -31.56391, lng: 147.154312 };
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

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
    isLoadingBeers: false,
    isLoadingBars: false,
    isLoadingEvents: false,
    isError: false,
  });

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

  useEffect(() => {
    dispatch({ type: 'BARS_FETCH_INIT' });
    fetch(API_BARS)
      .then((response) => response.json())
      .then((result) => {
        dispatch({ type: 'BARS_FETCH_SUCCESS', payload: result.bars });

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


  
  return (
    <Router>
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
            <h2>Beers</h2>
            {state.isLoadingBeers ? (
              <p>Loading beers...</p>
            ) : (
              <List list={filteredBeers} type="beer" />
            )}

            <h2>Bars</h2>
            {state.isLoadingBars ? (
              <p>Loading bars...</p>
            ) : (
              <List list={filteredBars} type="bar" />
            )}

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
          </>
        ) : (
          <p></p>
        )}

      

        <div style={{ flex: 1, position: 'relative' }}>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/beers/:id" element={<BeerShow beers={state.beers} />} />
            <Route path="/beers/:id/reviews" element={<BeerReviewIndex />} />
            <Route path="/bars/:id" element={<BarShow bars={state.bars} />} />
          </Routes>
        </div>

        <Paper elevation={3} style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
          <BottomNavigation showLabels>
            <BottomNavigationAction label="Favoritos" icon={<FavoriteIcon />} />
            <BottomNavigationAction component={Link} to="/" label="Inicio" icon={<HomeIcon />} />
            <BottomNavigationAction label="Perfil" icon={<PersonIcon />} />
            <BottomNavigationAction label="Search" icon={<DehazeIcon />} />
          </BottomNavigation>
        </Paper>
      </div>
    </Router>
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
    ) : (
      <span>{item.name}</span> 
    )}
  </li>
);

export default App;
