import axios from "axios";


class AuthService {

  login(username, password) {
    return axios
      .post("http://localhost:8081/public/user/login",
        {
          username: username,
          password: password
        }
      )
      .then(response => {
        console.log("Server login response: " + JSON.stringify(response.data));
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username, password, patientName, birthDate, personalIdentificationCode, sex, address, email, phone) {
    return axios
      .post("http://localhost:8081/public/user/register",
        {
          username: username,
          password: password,
          patientName: patientName,
          birthDate: birthDate,
          personalIdentificationCode: personalIdentificationCode,
          sex: sex,
          contactDetails: {
            address: address,
            email: email,
            phone: phone
          }
        }
      )
      .then(response => {
        console.log("Server register response data: " + JSON.stringify(response.data));
        console.log("Server register response status: " + JSON.stringify(response.status));
        if(response.status == 200){
          return this.login(username, password);
        }
      });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}
export default new AuthService();