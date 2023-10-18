import base_url from '../base_url';

export default function getPermissionList(page) {
  let url = base_url + `approve/permissionList/${page}`;
  return fetch(url, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  }).then((res) => {
    return res.json();
  });
}
