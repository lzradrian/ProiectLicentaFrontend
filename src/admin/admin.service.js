import axios from 'axios';
import authHeader from '../authentication/auth-header';

const URL = "http://localhost:8081/admin/user/";

class AdminService {

  getAllUsers() {
    return axios.get(URL, 
      { headers: authHeader() }
      )
      .then(response => {
        if (response.data) {
          return response.data;
        }
      });
  }

  createUser(user) {
    return axios
      .post(URL,
        user,
        { headers: authHeader() }
      )
      .then(response => {
        if (response.status == 200) {
          return response.data;
        }
      });
  }

  updateUser(user) {
    return axios
      .put(URL,
        user,
        { headers: authHeader() }
      )
      .then(response => {
        if (response.status == 200) {
          return response.data;
        }
      });
  }

  deleteUser(username) {
    return axios
      .delete(URL + username,
        { headers: authHeader() }
      )
      .then(response => {
        if (response.status == 200) {
          return "user deleted succesfully";
        }
      });
  }
}

export default new AdminService();
