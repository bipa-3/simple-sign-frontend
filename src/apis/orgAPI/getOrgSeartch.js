import axios from 'axios';
import base_url from '../base_url';

const api = axios.create({
  baseURL: base_url,
  withCredentials: true,
});

export const getOrgSeartch = (category, search) => {
  return api.get(`/orgsearch`, {
    params: {
      category: category,
      search: search,
    },
  });
};
