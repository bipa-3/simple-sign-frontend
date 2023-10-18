export default function insertApprovalDoc(data) {
  let url = `http://localhost:8080/approve/register`;
  const jsonData = JSON.stringify(data);

  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: jsonData,
  });
}
