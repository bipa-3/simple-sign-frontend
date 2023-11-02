import base_url from '../base_url';

export default function insertLowerReply(data) {
  let url = base_url + `reply/insertLowerReply`;
  return fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: data,
  });
}
