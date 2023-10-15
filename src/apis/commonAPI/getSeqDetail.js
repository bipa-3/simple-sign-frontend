import base_url from '../base_url';

export default function getSeqDetail(data) {
  let url = base_url + `manage/seq/detail/${data}`;
  return fetch(url, { headers: { Accept: 'application/json' } });
}
