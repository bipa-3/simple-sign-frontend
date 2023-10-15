import base_url from '../base_url';

export default function delForm(data) {
  let url = base_url + `form/${data}`;

  return fetch(url, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
}
