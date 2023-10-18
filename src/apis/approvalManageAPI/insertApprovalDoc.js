import base_url from '../base_url';

export default function insertApprovalDoc(data) {
  let url = base_url + `approve/register`;
  const jsonData = JSON.stringify(data);

  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: jsonData,
  });
}
