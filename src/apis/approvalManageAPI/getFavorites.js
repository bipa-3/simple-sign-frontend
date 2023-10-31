import base_url from '../base_url';

export default function getFavorites() {
  let url = base_url + `approve/favorites`;
  return fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }).then((res) => {
    return res.json();
  });
}
