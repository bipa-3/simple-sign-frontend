import axios from 'axios';
import base_url from '../base_url';

export default function getViewItems(boxId) {
  const url = base_url + `approvbox/box/detail/viewitem?boxId=${boxId}`;
  return axios.get(url);
}
