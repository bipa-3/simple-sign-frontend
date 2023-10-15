import base_url from '../base_url';

export default function getDefaultApprovalLine(data) {
  let url = base_url + `manage/form/detail/dal/${data}`;
  return fetch(url, { headers: { Accept: 'application/json' } });
}
