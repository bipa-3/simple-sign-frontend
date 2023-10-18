export default function updateApprovalDoc(page, data) {
  let url = `http://localhost:8080/approve/${page}`;
  return fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
}
