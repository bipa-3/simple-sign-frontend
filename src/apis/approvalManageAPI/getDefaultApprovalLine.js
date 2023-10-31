import base_url from '../base_url';
import errorHandle from '../errorHandle';

export default function getDefaultApprovalLine(form_code) {
  let url = base_url + `approve/defaultApprovalLine/${form_code}`;
  return fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }).then((res) => {
    if (res.status === 200) {
      return res.json();
    } else {
      errorHandle(res);
    }
  });
}
