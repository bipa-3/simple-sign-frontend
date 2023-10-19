import base_url from '../base_url';

export default function delSeq(data) {
  let url = base_url + `/manage/seq/${data}`;

  return fetch(url, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
}
