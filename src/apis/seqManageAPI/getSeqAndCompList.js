import base_url from '../base_url';

export default function getCompanyList(data) {
  let url = base_url + 'manage/seq/list';

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
