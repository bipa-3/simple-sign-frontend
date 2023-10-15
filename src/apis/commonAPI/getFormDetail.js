import base_url from '../base_url';

export default function getFormDetail(data) {
  let url = base_url + `manage/form/detail/${data}`;
  return fetch(url, { headers: { Accept: 'application/json' } });
}
