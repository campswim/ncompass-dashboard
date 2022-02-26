import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, NavLink } from 'react-router-dom';
import Home from '../pages/home/home';
import FailedOrders from '../pages/failed-orders/failed-orders';
import OrderView from '../pages/order-view/order-view';
import Settings from '../pages/settings/settings';
import routes from '../routes';
import { ListItem } from '@mui/material';
import {ReactComponent as Logo} from '../logo.svg';

const NavBar = () => {
  const [linkId, setLinkId] = useState(null);
  const [inputId, setInputId] = useState(null);
  const [inputDisplay, setInputDisplay] = useState(null);
  const [redirect, setRedirect] = useState(false);

  const handleClick = event => {
    event.preventDefault();
    setInputDisplay(null);
  };

  // Sets the inputId equal to the user's input in the input field and sets linkId to null.
  const handleSubmit = event => {
    event.preventDefault();
    if (typeof inputDisplay === 'number') {
        setInputId(inputDisplay);
        setLinkId(null);
        setRedirect(true);
    } else setInputDisplay('Need a number.');
  };

  const handleChange = event => {
    let id = parseInt(event.target.value);
    typeof id === 'number' ? setInputDisplay(id) : setInputDisplay('Enter a number.');
  };

  // Retrieves the id from params.state. 
  const getIdOnClick = num => {
    let id;
    if (num) id = parseInt(num);
    if (id) {
      if (inputDisplay) {
        if (inputDisplay !== id) {
          setLinkId(id);
          setInputDisplay(id);
          setInputId(null);
        } else {
          // console.log('id === inputDisplay');
        }
      } else {
        if(id !== inputId) {
          setLinkId(id);
          setInputDisplay(id);
          setInputId(null);
        } else {
          setInputDisplay(inputId);
        }
      }
    }
  };

  const links = (
      routes.map((prop, key) => {
        return prop.path === '/order-view' ? (
          <NavLink
            to={{
              pathname: prop.path,
              state: {
                order: inputId ? inputId : linkId,
            },
            }}
            key={key}
            className='nav-link'
            activeStyle={{ border: '1px solid cornflowerblue', borderRadius: '20px', margin: '0', color: 'orange' }}
          >
            <ListItem button style={{ padding: '0 1rem 0 1.5rem', margin: '0' }}>
              <prop.icon style={{ fontSize: '2rem', padding: '0', margin: '0' }} />
              <h5 value={prop.name} className='list-item-text'>{prop.name}</h5>
            </ListItem>
          </NavLink>
        ) : (
          <NavLink
            to={prop.path}
            key={key}
            className='nav-link'
            id={prop.name}
            activeStyle={{ border: '1px solid cornflowerblue', borderRadius: '20px', margin: '0', color: 'orange' }}
          >
            <ListItem button style={{ padding: '0 1rem 0 1.5rem', margin: '0' }}>
              <prop.icon style={{ fontSize: '2rem', padding: '0', margin: '0' }} />
              <h5 value={prop.name} className='list-item-text'>{prop.name}</h5>
            </ListItem>
          </NavLink>
        );
      })
  );

  return (
    <Router>
      <nav className='navbar'>
        <div className='logo-links'>
          <div className="logo">
            <a href={process.env.REACT_APP_HOME}><Logo /></a>
            <h1>{' '} Orders</h1>
          </div>
          <div className="navbar-links-mobile">{links}</div>
          <div className="navbar-links">{links}</div>
        </div>
        <div className='order-search'>
          <input
            className='search-field'
            value={inputDisplay ? inputDisplay : ''}
            placeholder="Order Search by ID"
            onChange={handleChange}
            onKeyPress={event => event.key === 'Enter' ? handleSubmit(event) : {}}
            onClick={handleClick}
          />
        </div>
      </nav>
      <main className='main'>
      <Switch>
        {/* <Route exact path='/' >
          <Home />
        </Route> */}
        <Redirect exact from='/' to='/dashboard' />
        <Route exact path='/dashboard'>
          <Home />
        </Route>
        <Route exact path='/failed-orders'>
          <FailedOrders />
        </Route>
        <Route exact path='/order-view'>
          <OrderView getId={getIdOnClick}/>
        </Route>
        <Route exact path='/settings'>
          <Settings />
        </Route>
      </Switch>
      {redirect === true ? (
        <Redirect 
          to={{
            pathname: '/order-view',
            state: {
              order: inputId ? inputId : linkId,
            },
          }}
        />
      ) : (
        '' 
      )}
      </main>
    </Router>
  );
};

export default NavBar;
