export default function getFormDetail(data) {
  let url = `http://localhost:8080/manage/form/detail/${data}`;
  console.log('api data:', url);
  return fetch(url, { headers: { Accept: 'application/json' } });
}
