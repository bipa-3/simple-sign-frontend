import base_url from '../base_url';

export default function insertCancelApproval(page) {
  let url = base_url + `approve/cancelApproval/${page}`;
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
}
