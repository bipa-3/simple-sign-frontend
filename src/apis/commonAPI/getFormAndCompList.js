import base_url from '../base_url';

export default function getFormAndCompList(data) {
  let url = base_url + 'manage/form/list';

  const jsonData = JSON.stringify(data);

  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: jsonData,
  });
}
