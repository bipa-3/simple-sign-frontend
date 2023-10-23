import base_url from '../base_url';
import errorHandle from '../errorHandle';

export default function getSequenceList(form_code) {
  let url = base_url + `manage/form/seqTitleList?formCode=${form_code}`;
  return fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }).then((res) => {
    if (res.status === 200) {
      return res.json();
    } else {
      errorHandle(res);
    }
  });
}
