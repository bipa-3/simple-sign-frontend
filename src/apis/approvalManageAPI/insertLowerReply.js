export default function insertLowerReply(data) {
  return fetch(`http://localhost:8080/reply/insertLowerReply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
}
