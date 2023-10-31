import axios from 'axios';
import base_url from '../base_url';

const api = axios.create({
  baseURL: base_url,
});

export const getSign = () => {
  return api.get('/userinfo/sign');
};

export const getUpdateSign = () => {
  return api.get('/updateinfo/sign');
};

export const getApproverSign = (signFileId) => {
  return api.get(`/userinfo/sign/${signFileId}`);
};
