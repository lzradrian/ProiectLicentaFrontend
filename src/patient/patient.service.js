import axios from 'axios';
import authHeader from '../authentication/auth-header';

class PatientService {

  getPatientMedicalSheets(patientUsername) {
    return axios.get("http://localhost:8081/patient/" + patientUsername + "/medical-sheets",
      { headers: authHeader() }
    )
      .then(response => {
        console.log("Server get patient medical sheets response: " + response.data);
        return response.data;
      });
  }
}

export default new PatientService();
