import base_url from '../base_url';

export default function getForm(form_code) {
  let url = base_url + `manage/form/detail/${form_code}`;
  return fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }).then((res) => {
    return res.json();
  });
}
