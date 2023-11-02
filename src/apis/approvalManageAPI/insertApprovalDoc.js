import base_url from '../base_url';

export default function insertApprovalDoc(data) {
  //console.log(data);
  let url = base_url + `approve/register`;
  //const jsonData = JSON.stringify(data);

  return fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: data,
  });
}
