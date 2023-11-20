import axios from 'axios';
import base_url from '../base_url';

const api = axios.create({
  baseURL: base_url,
  withCredentials: true,
});

export const getTreeView = (comp) => {
  return api.get('/orgTreeView', {
    params: {
      comp: comp,
    },
  });
};
