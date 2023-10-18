import axios from 'axios';

export default function postPassword(data) {
  const url = `http://localhost:8080/user/password/change`;
  return axios.post(url, data);
}
