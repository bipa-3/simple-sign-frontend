import axios from 'axios';
import base_url from '../base_url';

axios.defaults.withCredentials = true;

export default function insertApprovalBox(approvalBoxState) {
  const url = base_url + `approvbox/insert`;
  const payload = {
    ...approvalBoxState,
  };

  return axios.post(url, payload);
}
