import axios from 'axios';
import base_url from '../base_url';

const api = axios.create({
  baseURL: base_url,
});

export const getProfile = () => {
  return api.get('/userinfo/profile');
};
