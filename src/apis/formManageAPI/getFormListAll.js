import base_url from '../base_url';

export default function getFormListAll() {
  let url = base_url + `manage/form/list/all`;
  return fetch(url, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  });
}
