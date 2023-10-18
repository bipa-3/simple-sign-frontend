export default function getReplyList(approval_doc_id) {
  return fetch(`http://localhost:8080/reply/${approval_doc_id}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }).then((res) => {
    return res.json();
  });
}
