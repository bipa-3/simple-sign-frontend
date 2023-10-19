import base_url from '../base_url';

export default function insertForm(data) {
  let url = base_url + 'manage/form/detail';
  const jsonData = JSON.stringify(data);

  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: jsonData,
    credentials: 'include',
  });
}
