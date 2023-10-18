export default function getHasApproval(page) {
  let url = `http://localhost:8080/approve/hasUpdate/${page}`;
  return fetch(url, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  }).then((res) => {
    return res.json();
  });
}
