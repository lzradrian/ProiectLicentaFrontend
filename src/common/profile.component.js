import React, { Component } from "react";
import AuthService from "../authentication/auth.service";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    const user = AuthService.getCurrentUser();
    this.state = {
      isAdminRole: user.roleName.includes("ROLE_ADMIN"),
      isDoctorRole: user.roleName.includes("ROLE_DOCTOR"),
      isPatientRole: user.roleName.includes("ROLE_PATIENT"),
      currentUser: user
    };
  }

  render() {
    const { currentUser, isAdminRole, isDoctorRole, isPatientRole } = this.state;
    return (
      <div className="App">
        <div className="App-body">
          <header>
            <h2 style={{ color: 'white' }}>
              Hello <strong>{currentUser.username}</strong>, this is your profile page!<br /><br /><br /><br />
            </h2>
          </header>

          <div><h4 style={{ color: 'white' }}>Account details:</h4><br/>
            <p>Username: {currentUser.username}</p>
            {
              isAdminRole &&
              <p>Name: {currentUser.adminName}</p>
            }
            {
              isDoctorRole &&
              <div>
                <p>Name: {currentUser.doctorName}</p>
                <p>Specialty: {currentUser.specialty}</p>
              </div>
            }
            {
              isPatientRole &&
              <div>
                <p>Name: {currentUser.patientName}</p>
                <p>Personal identification code: {currentUser.personalIdentificationCode}</p>
                <p>Sex: {currentUser.sex}</p>
                <p>Birth date: {currentUser.birthDate}</p>
              </div>
            }
            <p>Email: {currentUser.contactDetails.email}</p>
            {currentUser.contactDetails.phone && <p>Phone: {currentUser.contactDetails.phone}</p>}
            {currentUser.contactDetails.address && <p>Address: {currentUser.contactDetails.address}</p>}
          </div >
        </div>
      </div >
    );
  }
}
