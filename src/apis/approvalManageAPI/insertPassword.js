import base_url from '../base_url';

export default function insertPassword(password) {
  let url = base_url + '/approve/password';
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ password: password }),
  });
}
