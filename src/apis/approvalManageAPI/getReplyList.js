import base_url from '../base_url';
import errorHandle from '../errorHandle';

export default function getReplyList(approval_doc_id) {
  let url = base_url + `reply/${approval_doc_id}`;
  return fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }).then((res) => {
    if (res.status === 200) {
      return res.json();
    } else {
      errorHandle(res);
    }
  });
}
