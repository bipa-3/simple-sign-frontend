import base_url from '../base_url';

export default function insertApproval() {
  let url = base_url + `approve/approvalAll/`;
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
}
