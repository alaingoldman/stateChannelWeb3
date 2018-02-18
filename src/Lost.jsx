import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Lost extends Component {
  render() {
    return (
    	<div>
    	  <a id="start"></a>
    	  <div className="main-container">
    	    <section id="notify" className="text-center height-100 imagebg" >
    	      <div className="pos-vertical-center">
    	        <h2>You{"'"}re lost.</h2>
    	        <h4>You{"'"}ve encountered an error while loading this page.</h4>
                <div className="text-center">
                  <Link to="/">
                    <div className="btn text-center btn-primary egg-btn2">
                       <span> Home </span>
                    </div>
                  </Link>
                </div>
    	      </div>
    	    </section>
    	  </div>
    	  <a className="back-to-top inner-link" href="#start" datascrollclass="100vh:active">
    	   <i className="stack-interface stack-up-open-big"></i>
    	  </a>
    	</div>
    );
  }
}

export default Lost