import base_url from '../base_url';

export default function insertReturn(page, version) {
  let url = base_url + `approve/return/${page}`;
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ version }),
  });
}
