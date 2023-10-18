import axios from 'axios';
import base_url from '../base_url';

const api = axios.create({
  baseURL: base_url,
});

export const postPassword = (data) => {
  return api.post(`/user/password/change`, data);
};
