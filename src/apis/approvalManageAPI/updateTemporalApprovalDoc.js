import base_url from '../base_url';

export default function updateApprovalDoc(page, data) {
  let url = base_url + `approve/temp/${page}`;
  return fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    body: data,
  });
}
