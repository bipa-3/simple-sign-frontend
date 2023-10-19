import base_url from '../base_url';

export default function deleteApprovalDoc(page) {
  let url = base_url + `approve/${page}`;
  return fetch(url, {
    method: 'DETETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
}
