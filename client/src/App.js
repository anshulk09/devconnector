import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authAction';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Lending';
import Footer from './components/layout/Footer';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import { clearCurrentProfile } from './actions/profileActions';
import PrivateRoute from './components/common/PrivateRoute';
import CreateProfile from './components/create-profile/CreateProfile';

import './App.css';

//check for token
if(localStorage.jwtToken){
  //set auth token header auth
  setAuthToken(localStorage.jwtToken);
  //decode token
  const decoded = jwt_decode(localStorage.jwtToken);
  //set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  //check for expire token 
  const currentTime = Date.now() / 1000;
  if(decoded.exp<currentTime){
    store.dispatch(clearCurrentProfile());
    store.dispatch(logoutUser());
    //redirect to login
    window.location.href='/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <Router>
          <div className="App">
            <Navbar/>
            <Route exact path="/" component={ Landing } />
            <div className="container" >
              <Route exact path='/register' component = {Register} />
              <Route exact path='/Login' component = {Login} />
              <Switch>
              <PrivateRoute exact path='/dashboard' component={Dashboard} />
              </Switch>
              <Switch>
              <PrivateRoute exact path='/create-profile' component={CreateProfile} />
              </Switch>
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>      
    );
  }
}

export default App;
