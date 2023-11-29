import base_url from '../base_url';
import ErrorHandle from '../errorHandle';

export default function getPermissionList(page) {
  let url = base_url + `approve/permissionList/${page}`;
  return fetch(url, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  }).then((res) => {
    if (res.status === 200) {
      return res.json();
    } else {
      ErrorHandle(res);
    }
  });
}
