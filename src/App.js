import logo from './logo.svg';
import './App.css';
import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import AuthService from "./authentication/auth.service";
import Login from "./authentication/login.component";
import Register from './authentication/register.component';

import Home from "./common/home.component";
import Profile from "./common/profile.component";

import EventBus from "./common/EventBus";

class App extends Component {

  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
      });
    }
    
    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
    this.setState({
      currentUser: undefined,
    });
  }

  
  render() {
    const { currentUser } = this.state;

    return (
      <div>


        <nav className="navbar navbar-expand navbar-dark bg-dark">

          <div className="navbar-nav mr-auto">
            
            <li className="nav-item">
              <Link to={"/"} className="nav-link">Home</Link>
            </li>

          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>
               <li className="nav-item">
                 <Link to={"/register"} className="nav-link">
                   Register
                 </Link>
               </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
            <Switch>
              <Route exact path={["/", "/home"]} component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />

              <Route exact path="/profile" component={Profile} />
            </Switch>
        </div>

      </div>
    );
  }
}

export default App;
