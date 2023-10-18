import axios from 'axios';
import base_url from '../base_url';

const api = axios.create({
  baseURL: base_url,
  withCredentials: true,
});

export const postLogin = (loginId, password) => {
  return api.post('/login', {
    loginId,
    password,
  });
};
