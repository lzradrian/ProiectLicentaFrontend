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
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data.userState));
          localStorage.setItem("accessToken", JSON.stringify(response.data.accessToken))
        }
        return response.data.userState;
      });
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
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
        if(response.status == 200){
          return this.login(username, password);
        }
      });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  getCurrentAccessToken() {
    return JSON.parse(localStorage.getItem('accessToken'));
  }
}
export default new AuthService();