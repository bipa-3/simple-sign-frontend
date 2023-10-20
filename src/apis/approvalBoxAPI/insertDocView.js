import axios from 'axios';
import base_url from '../base_url';

axios.defaults.withCredentials = true;

export default function insertDocView(docId) {
  const url = base_url + `approvbox/doc/read?docId=${docId}`;
  return axios.post(url).catch((error) => {
    console.error('Error inserting document view:', error);
  });
}
