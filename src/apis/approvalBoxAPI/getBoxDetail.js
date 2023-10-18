import axios from 'axios';
import base_url from '../base_url';

export default function getBoxDetail(boxId) {
  const url = base_url + `approvbox/box/detail?boxId=${boxId}`;
  return axios.get(url);
}
