export default function getSequenceList(form_code) {
  let url = `http://localhost:8080/manage/form/seqTitleList?formCode=${form_code}`;
  return fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }).then((res) => {
    return res.json();
  });
}
