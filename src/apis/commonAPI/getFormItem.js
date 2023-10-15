import base_url from '../base_url';

export default function getFormItem() {
  let url = base_url + `manage/form/item/list`;
  return fetch(url, { headers: { Accept: 'application/json' } });
}
