import React, { Component } from "react";
import AuthService from "../authentication/auth.service";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: AuthService.getCurrentUser()
    };
  }

  render() {
    const { currentUser } = this.state;
    return (
      <div className="container">

        <header className="jumbotron">
          <h3>
            Hello <strong>{currentUser.username}</strong> , this is your profile page!
          </h3>
        </header>

      </div>
    );
  }
}
