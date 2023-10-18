import axios from 'axios';
import base_url from '../base_url';
const https = require('https');
const fs = require('fs');

const agent = new https.Agent({
  ca: fs.readFileSync('../../ca-certificate.pem'), // CA 또는 루트 인증서 파일
});

const api = axios.create({
  baseURL: base_url,
  withCredentials: true,
});

export const postLogin = (loginId, password) => {
  return api.post('/login', {
    httpsAgent: agent,
    loginId,
    password,
  });
};
