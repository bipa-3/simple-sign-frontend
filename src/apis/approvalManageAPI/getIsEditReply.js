import base_url from '../base_url';
import ErrorHandle from '../errorHandle';

export default function getIsEditReply(replyId) {
  let url = base_url + `reply/isEdit/${replyId}`;
  return fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }).then((res) => {
    if (res.status === 200) {
      return res.json();
    } else {
      ErrorHandle(res);
    }
  });
}
