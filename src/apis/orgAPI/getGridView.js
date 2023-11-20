import axios from 'axios';
import base_url from '../base_url';

const api = axios.create({
  baseURL: base_url,
  withCredentials: true,
});

export const getGridView = (selectedNode, view, isChecked) => {
  return api.get(`/topGridView/${selectedNode}`, {
    params: {
      type: view,
      isChecked: isChecked,
    },
  });
};
