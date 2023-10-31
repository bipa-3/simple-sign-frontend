import base_url from '../base_url';

export default function deleteFavorites(form_code) {
  let url = base_url + `approve/favorites/${form_code}`;
  return fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
}
