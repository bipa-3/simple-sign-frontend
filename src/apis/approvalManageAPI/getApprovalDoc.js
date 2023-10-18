export default function getApprovalDoc(approval_doc_id) {
  let url = `http://localhost:8080/approve/detail/${approval_doc_id}`;
  return fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }).then((res) => {
    return res.json();
  });
}
