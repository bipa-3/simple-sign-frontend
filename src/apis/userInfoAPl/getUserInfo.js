import axios from 'axios';

export default function getUserInfo() {
  const url = `http://localhost:8080/userinfo`;
  return axios.get(url);
}
