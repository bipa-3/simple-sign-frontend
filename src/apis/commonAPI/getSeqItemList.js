import base_url from '../base_url';

export default function getSeqItemList() {
  let url = base_url + 'common/seq/item';

  return fetch(url, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  });
}
