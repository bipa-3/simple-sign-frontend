import axios from 'axios';
import alarm_base_url from '../alarm_base_url';

const api = axios.create({
  baseURL: alarm_base_url,
});

export const putAlarmUpdate = (alarmId) => {
  return api.put(`/alarm/update/${alarmId}`);
};
