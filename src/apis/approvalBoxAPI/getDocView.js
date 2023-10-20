import axios from 'axios';
import base_url from '../base_url';

axios.defaults.withCredentials = true;

export default function getDocView() {
  const url = base_url + `approvbox/doc/getread`;
  return axios.get(url).catch((error) => {
    console.error('Error inserting document view:', error);
  });
}
