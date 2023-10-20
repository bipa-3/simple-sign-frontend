import base_url from '../base_url';

export default function getDocBoxList(company) {
  let url = base_url + `approvbox/list?company=${company}`;

  return fetch(url, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  });
}
