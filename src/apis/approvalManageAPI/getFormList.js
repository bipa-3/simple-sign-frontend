export default function getFormList() {
  let url = 'http://localhost:8080/manage/form/formTitleList';
  return fetch(url, { headers: { Accept: 'application/json' } });
}