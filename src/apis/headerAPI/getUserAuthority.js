import axios from 'axios';
import base_url from '../base_url';

const api = axios.create({
  baseURL: base_url,
});

export const getUserAuthority = () => {
  return api.get(`/user/authority`);
};
