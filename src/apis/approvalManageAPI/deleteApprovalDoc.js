export default function deleteApprovalDoc(page) {
  let url = `http://localhost:8080/approve/${page}`;
  return fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
}
