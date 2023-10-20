import base_url from '../base_url';
import axios from 'axios';

axios.defaults.withCredentials = true;

export default function deleteApprovalBox(boxId) {
  const url = base_url + `approvbox/box/delete?boxId=${boxId}`;
  return axios.put(url);
}
