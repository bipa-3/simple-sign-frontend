import base_url from '../base_url';

export default function updateReply(replyId, data) {
  let url = base_url + `reply/${replyId}`;
  fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
}
