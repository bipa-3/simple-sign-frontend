import base_url from '../base_url';

export default function getHasApproval(page) {
  let url = base_url + `approve/hasApproval/${page}`;
  return fetch(url, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  }).then((res) => {
    return res.json();
  });
}
