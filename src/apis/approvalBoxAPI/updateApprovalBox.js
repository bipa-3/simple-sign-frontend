import axios from 'axios';
import base_url from '../base_url';

axios.defaults.withCredentials = true;

export default function updateApprovalBox(approvalBoxState) {
  const url = base_url + `approvbox/update`;
  const payload = {
    ...approvalBoxState,
  };

  return axios.put(url, payload);
}
