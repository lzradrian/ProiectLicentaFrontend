import './App.css';
import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import AuthService from "./authentication/auth.service";
import Login from "./authentication/login.component";
import Register from './authentication/register.component';

import Home from "./common/home.component";
import Profile from "./common/profile.component";

import UserManagementBoard from './admin/admin-user-management.component';

import DoctorPredictionBoard from './doctor/doctor-prediction.component'
import DoctorMedicalSheetBoard from './doctor/doctor-medical-sheets.component';

import PatientMedicalSheetBoard from './patient/patient-medical-sheets.component';

import EventBus from "./common/EventBus";

class App extends Component {

  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showAdminBoard: false,
      showDoctorBoard: false,
      showPatientBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showAdminBoard: user.roleName.includes("ROLE_ADMIN"),
        showDoctorBoard: user.roleName.includes("ROLE_DOCTOR"),
        showPatientBoard: user.roleName.includes("ROLE_PATIENT"),
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
      showAdminBoard: false,
      showDoctorBoard: false,
      showPatientBoard: false,
      currentUser: undefined,
    });
  }

  
  render() {
    const { currentUser, showAdminBoard, showDoctorBoard, showPatientBoard} = this.state;

    return (
      <div>


        <nav className="navbar navbar-expand navbar-dark bg-dark">

          <div className="navbar-nav mr-auto">
            
            <li className="nav-item">
              <Link to={"/"} className="nav-link">Home</Link>
            </li>

          
            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/admin-users-management"} className="nav-link">
                  Users Management Board
                </Link>
              </li>
            )}

            {showDoctorBoard && (
              <li className="nav-item">
                <Link to={"/doctor-prediction"} className="nav-link">
                  Diabetes Prediction Board
                </Link>
              </li>
            )}

            {showDoctorBoard && (
              <li className="nav-item">
                <Link to={"/doctor-medical-sheets"} className="nav-link">
                  Medical Sheets Board
                </Link>
              </li>
            )}

            {showPatientBoard && (
              <li className="nav-item">
                <Link to={"/patient-medical-sheets"} className="nav-link">
                   Medical Sheets Board
                </Link>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ms-auto">
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

              <Route exact path="/admin-users-management" component={UserManagementBoard} />

              <Route exact path="/doctor-prediction" component={DoctorPredictionBoard} />
              <Route exact path="/doctor-medical-sheets" component={DoctorMedicalSheetBoard} />

              <Route exact path="/patient-medical-sheets" component={PatientMedicalSheetBoard} />
            </Switch>
        </div>
      </div>
    );
  }
}

export default App;
