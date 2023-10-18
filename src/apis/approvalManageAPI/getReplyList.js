import base_url from '../base_url';

export default function getReplyList(approval_doc_id) {
  let url = base_url + `reply/${approval_doc_id}`;
  return fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }).then((res) => {
    return res.json();
  });
}
