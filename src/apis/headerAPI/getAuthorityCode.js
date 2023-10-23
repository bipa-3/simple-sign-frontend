import axios from 'axios';
import base_url from '../base_url';

const api = axios.create({
  baseURL: base_url,
});

export const getAuthorityCode = (orgUserId) => {
  return api.get(`authority`, {
    params: {
      orgUserId: orgUserId,
    },
  });
};
