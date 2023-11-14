import axios from 'axios';
import alarm_base_url from '../alarm_base_url';

const api = axios.create({
  baseURL: alarm_base_url,
  withCredentials: true,
});

export const putAlarmUpdate = (alarmId) => {
  return api.put(`/update/${alarmId}`);
};
