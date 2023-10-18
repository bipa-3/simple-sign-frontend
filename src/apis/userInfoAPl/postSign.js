import axios from 'axios';
import base_url from '../base_url';

const api = axios.create({
  baseURL: base_url,
});

export const postSign = (formData) => {
  return api.post('/updateinfo/sign', formData);
};
