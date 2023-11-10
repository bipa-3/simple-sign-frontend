import axios from 'axios';
import base_url from '../base_url';

const api = axios.create({
  baseURL: base_url,
});

export const getAlarm = () => {
  return api.get('/alarm');
};

export const getAlarmCount = () => {
  return api.get('/alarm/count');
};
