import axios from 'axios';

export default function getDocumentsCount(name) {
  const url = `http://localhost:8080/approvbox/doc/count?boxName=${name}`;
  return axios.get(url);
}
