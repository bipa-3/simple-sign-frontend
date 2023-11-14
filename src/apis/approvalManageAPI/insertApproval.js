import base_url from '../base_url';

export default function insertApproval(page, version) {
  let url = base_url + `approve/approval/${page}`;
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ version }),
  });
}
