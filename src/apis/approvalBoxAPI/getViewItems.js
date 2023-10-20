import axios from 'axios';
import base_url from '../base_url';

axios.defaults.withCredentials = true;

export default function getViewItems(boxId) {
  const url = base_url + `approvbox/box/detail/viewitem?boxId=${boxId}`;
  return axios.get(url);
}
