import base_url from '../base_url';

export default function updateForm(data) {
  let url = base_url + 'manage/form/detail';

  const jsonData = JSON.stringify(data);

  return fetch(url, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: jsonData,
  });
}
