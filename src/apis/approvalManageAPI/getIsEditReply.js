import base_url from '../base_url';

export default function getIsEditReply(replyId) {
  let url = base_url + `reply/isEdit/${replyId}`;
  return fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }).then((res) => {
    return res.json();
  });
}
