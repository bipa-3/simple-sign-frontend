import base_url from '../base_url';

export default function insertSeq(data) {
  let url = base_url + 'manage/seq/detail';
  const jsonData = JSON.stringify(data);

  console.log(data);
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
