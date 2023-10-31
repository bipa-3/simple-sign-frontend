import base_url from '../base_url';

export default function insertFavorites(form_code) {
  let url = base_url + `approve/favorites/${form_code}`;
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
}
