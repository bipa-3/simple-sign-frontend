import base_url from '../base_url';

export default function getApprovalKind() {
  let url = base_url + 'common/approval/kind';

  return fetch(url, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  });
}
