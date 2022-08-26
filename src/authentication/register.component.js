import React, { Component } from "react";

import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";

import errorHandler from "../common/ErrorHandler";
import AuthService from "./auth.service";

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      username: "",
      password: "",
      patientName: "",
      birthDate: "",
      personalIdentificationCode: "",
      sex: "",

      address: "",
      email: "",
      phone: "",

      loading: false,
      message: ""
    };
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleRegister(e) {
    e.preventDefault();

    this.setState({
      message: "",
      loading: true
    });

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.register(this.state.username, this.state.password, this.state.patientName, this.state.birthDate, this.state.personalIdentificationCode,
        this.state.sex, this.state.address, this.state.email, this.state.phone)
        .then(
          () => {
            window.location.reload();
          },
          error => {
            let resMessage = errorHandler(error)
            this.setState({
              loading: false,
              message: resMessage
            });
          }
        );
    } else {
      this.setState({
        loading: false
      });
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-body">

          <Form
            onSubmit={this.handleRegister}
            ref={c => {
              this.form = c;
            }}
          >

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={this.state.username}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="patientName">Name</label>
              <input
                type="text"
                className="form-control"
                name="patientName"
                value={this.state.patientName}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="birthDate">BirthDate</label>
              <input
                type="text"
                className="form-control"
                name="birthDate"
                value={this.state.birthDate}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="personalIdentificationCode">Personal Identification Code</label>
              <input
                type="text"
                className="form-control"
                name="personalIdentificationCode"
                value={this.state.personalIdentificationCode}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="sex">Sex</label>
              <input
                type="text"
                className="form-control"
                name="sex"
                value={this.state.sex}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                className="form-control"
                name="address"
                value={this.state.address}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                className="form-control"
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={this.state.phone}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="form-group">
              <button
                className="btn btn-primary btn-block"
                disabled={this.state.loading}
              >
                {this.state.loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Register</span>
              </button>
            </div>

            {this.state.message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {this.state.message}
                </div>
              </div>
            )}
            <CheckButton
              style={{ display: "none" }}
              ref={c => {
                this.checkBtn = c;
              }}
            />
          </Form>
        </div>
      </div>
    );
  }
}