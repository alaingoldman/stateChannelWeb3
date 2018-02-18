import React, { Component } from 'react';
import { Route } from 'react-router-dom';
// import $ from 'jquery';

export default class Private extends Component {

  render() {
    const {component: Component, ...rest} = this.props;
    return (
      <Route {...rest} render={props => ( <Component web4={this.props.web4} {...props} /> )} />
    );
  }
}