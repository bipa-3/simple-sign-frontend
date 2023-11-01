import base_url from '../base_url';

export default function updateSeq(data) {
  let url = base_url + 'manage/seq/detail';

  const jsonData = JSON.stringify(data);

  return fetch(url, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: jsonData,
    credentials: 'include',
  });
}
