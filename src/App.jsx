import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import socketIOClient from "socket.io-client";

import Home         from './Home';
import Lost         from './Lost';
import About        from './About';
import Private      from './Private';
import BoxGame      from './BoxGame';
import ScrollToTop  from './ScrollToTop';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
          <ScrollToTop>
            <div>
              <Switch>
                  <Private exact path="/"   component={Home}/>
                  <Private path="/about"    component={About}/>
                  <Private path="/boxgame"  component={BoxGame}/>
                  <Route render={()  => (<Lost />)}   />
              </Switch>
            </div>
          </ScrollToTop>
      </BrowserRouter>
    );
  }
}

export default App;