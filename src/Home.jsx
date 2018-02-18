import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Home extends Component {
  async componentDidMount() {
  	let response = await fetch('/users');
    let responseJson = await response.json();
  }
  // crap = () => {
  //   let x = this;
  // }

  render() {
    return (
      <div>
        <h2> home page </h2>
        <Link to="/boxgame">
          see box game
        </Link>
      </div>
    );
  }
}

export default Home;
