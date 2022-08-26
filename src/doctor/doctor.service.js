import axios from 'axios';
import authHeader from '../authentication/auth-header';

class DoctorService {

  makeDiabetesPrediction(input) {
    return axios.post("http://localhost:8081/doctor/diabetes_prediction",
      {
        glucose: input.glucose,
        weight: input.weight,
        height: input.height,
        age: input.age,
        diabetesPedigreeFunction: input.diabetesPedigreeFunction,
        relativesInfo: input.relativesInfoList
      },
      { headers: authHeader() }
    )
      .then(response => {
        console.log("Server diabetes predition response: " + response.data.message);
        return response.data.message;
      });
  }

  getAllPatients() {
    return axios.get("http://localhost:8081/doctor/patients",
      { headers: authHeader() }
    )
      .then(response => {
        return response.data;
      });
  }

  getAllMedicalSheets() {
    return axios.get("http://localhost:8081/doctor/medical-sheet",
      { headers: authHeader() }
    )
      .then(response => {
        return response.data;
      });
  }

  createMedicalSheet(input) {
    return axios.post("http://localhost:8081/doctor/medical-sheet",
      input,
      { headers: authHeader() }
    )
      .then(response => {
        return response.data;
      });
  }

  deleteMedicalSheet(id) {
    let url = "http://localhost:8081/doctor/medical-sheet/" + id;
    return axios.delete(url,
      { headers: authHeader() }
    )
      .then(response => {
        return "Deleted succesfully."
      });
  }
}

export default new DoctorService();
