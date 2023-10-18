export default function getPermissionList(page) {
  return fetch(`http://localhost:8080/approve/PermissionList/${page}`, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  }).then((res) => {
    return res.json();
  });
}
