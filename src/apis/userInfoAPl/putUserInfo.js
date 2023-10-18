import axios from 'axios';

export default function putUserInfo(data) {
  const url = `http://localhost:8080/updateinfo`;
  return axios.put(url, data);
}
