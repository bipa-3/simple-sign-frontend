import base_url from '../base_url';

export default function getFormList({ searchContent }) {
  let url =
    base_url + `manage/form/formTitleList?searchContent=${searchContent}`;
  return fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
}
