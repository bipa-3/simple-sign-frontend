import axios from 'axios';
import base_url from '../base_url';

axios.defaults.withCredentials = true;

export default function getDocumentsCount(name) {
  const url = base_url + `approvbox/doc/count?boxName=${name}`;
  return axios.get(url);
}
