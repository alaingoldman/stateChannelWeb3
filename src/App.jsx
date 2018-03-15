import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import socketIOClient from "socket.io-client";
import * as firebase from 'firebase';

import Home         from './Home';
import Lost         from './Lost';
import About        from './About';
import Private      from './Private';
import BoxGame      from './BoxGame';
import ScrollToTop  from './ScrollToTop';
import Firetest     from './Firetest';

class App extends Component {
  componentWillMount() {
    var config = {
      apiKey: 'AIzaSyCyVq3TQ-ZsE965YHSnzGnax-v25F8GUCk',
      authDomain: 'test-stre.firebaseapp.com',
      databaseURL: 'https://test-stre.firebaseio.com'
    };

    firebase.initializeApp(config);
  }

  render() {
    return (
      <BrowserRouter>
          <ScrollToTop>
            <div>
              <Switch>
                  <Private exact path="/"    component={Home}/>
                  <Private path="/about"     component={About}/>
                  <Private path="/boxgame"   component={BoxGame}/>
                  <Private path="/firetest"  component={Firetest}/>
                  <Route render={()  => (<Lost />)}   />
              </Switch>
            </div>
          </ScrollToTop>
      </BrowserRouter>
    );
  }
}

export default App;