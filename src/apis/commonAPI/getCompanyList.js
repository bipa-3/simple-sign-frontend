import base_url from '../base_url';

export default function getCompanyList() {
  let url = base_url + 'common/comp';

  return fetch(url, { headers: { Accept: 'application/json' } });
}
