import base_url from '../base_url';
import ErrorHandle from '../errorHandle';

export default function getApprovalDoc(approval_doc_id) {
  let url = base_url + `approve/detail/${approval_doc_id}`;
  return fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
}
