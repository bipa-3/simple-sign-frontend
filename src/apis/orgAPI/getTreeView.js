import axios from 'axios';
import base_url from '../base_url';

const api = axios.create({
  baseURL: base_url,
});

export const getTreeView = () => {
  return api.get('/orgTreeView');
};
