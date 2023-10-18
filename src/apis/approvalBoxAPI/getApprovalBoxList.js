import base_url from '../base_url';

export default function getApprovalBoxList() {
  let url = base_url + `approvbox/boxlist`;

  return fetch(url, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return response.json();
  });
}
