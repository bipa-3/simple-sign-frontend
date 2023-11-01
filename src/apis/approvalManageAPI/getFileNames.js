import base_url from '../base_url';

export default function getFileNames(approval_doc_id) {
  let url = base_url + `approve/fileNames/${approval_doc_id}`;
  return fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }).then((res) => {
    return res.json();
  });
}
