import base_url from '../base_url';
import errorHandle from '../errorHandle';

export default function getHasCancelApproval(page) {
  let url = base_url + `approve/hasCancelApproval/${page}`;
  return fetch(url, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  }).then((res) => {
    if (res.status === 200) {
      return res.json();
    } else {
      errorHandle(res);
    }
  });
}
