export default function insertReturn(page) {
  let url = `http://localhost:8080/approve/cancel/${page}`;
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
}
