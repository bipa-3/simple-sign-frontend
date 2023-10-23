import base_url from '../base_url';

export default function getRecommendForm(data) {
  let url = base_url + 'common/form/recommend';

  const jsonData = JSON.stringify(data);

  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: jsonData,
    credentials: 'include',
  });
}
