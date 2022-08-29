import React, { Component } from "react";

export default class Home extends Component {

  render() {
    return (
      <div className="App">
        <div className="App-body">
          <h1 style={{ color: 'white' }} >Hello! Welcome to our clinic website.</h1>
          <br /><br />
          <br /><br />
          <br /><br />
          <h4 style={{ color: 'white' }} >Our contact details:</h4>
          <p>Phone: 0770 989 787</p>
          <p>Email: clinic@gmail.com</p>
          <p>Address: Str. Old Street nr.6, Cluj, Romania.</p>
        </div>
      </div>
    );
  }
}
