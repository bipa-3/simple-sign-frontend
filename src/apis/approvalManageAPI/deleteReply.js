import base_url from '../base_url';

export default function (replyId) {
  let url = base_url + `reply/${replyId}`;
  return fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
}
