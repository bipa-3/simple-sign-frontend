// getUserCompany.js
import axios from 'axios';
import base_url from '../base_url';

axios.defaults.withCredentials = true;

export default function getUserCompany() {
  const url = base_url + `approvbox/company`;

  return axios
    .get(url)
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching user company:', error);
      throw error; // 에러를 다시 throw 하여 후속 처리에서 catch 할 수 있게 함
    });
}
